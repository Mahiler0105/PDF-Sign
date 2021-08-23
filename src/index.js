import React from 'react';
import {StyleSheet, Dimensions, Platform} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import Pdf from 'react-native-pdf';
import {PDFDocument} from 'pdf-lib';
import {_uint8ToBase64} from './utils/convertBase64';
import {
  BackScreen,
  OptionsSign,
  CancelEditMode,
  ConfirmEditMode,
  BannerEditMode,
} from './components';

const PDFExample = () => {
  const {bottom} = useSafeAreaInsets();
  const [numOfPage, setNumOfPage] = React.useState(1);
  const [isEditable, setIsEditable] = React.useState(false);
  const [base64InitFile, setBase64InitFile] = React.useState(null);
  const [base64ModifyFile, setBase64ModifyFile] = React.useState(null);
  const [pdfDimentions, setPdfDimentions] = React.useState({
    width: 0,
    height: 0,
  });
  const [signatureLocation, setSignatureLocation] = React.useState({
    page: 0,
    x: 0,
    y: 0,
  });

  React.useEffect(() => {
    const baseUrl = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
    fetch(`http://${baseUrl}:3000/imageBase64`, {method: 'GET'})
      .then(res => res.json())
      .then(data => setBase64InitFile(data.data));
  }, []);

  const handleSingleTap = async (page, x, y) => {
    if (isEditable) {
      console.log('page:', page);
      console.log('coordenadas:', x, y);
      setSignatureLocation({page, x, y});
      const baseUrl = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
      const signRes = await fetch(`http://${baseUrl}:3000/sign`, {
        method: 'GET',
      });
      const {data: base64Sign} = await signRes.json();

      const pdfDoc = await PDFDocument.load(base64InitFile);
      const pages = pdfDoc.getPages();
      const firstPage = pages[page - 1];

      const signatureImage = await pdfDoc.embedPng(base64Sign);
      if (Platform.OS === 'ios') {
        const h = Dimensions.get('screen').height * 0.88 - bottom;
        firstPage.drawImage(signatureImage, {
          x: (pdfDimentions.width * x - 12) / Dimensions.get('window').width,
          y: pdfDimentions.height - (pdfDimentions.height * (y + 12)) / h,
          width: 80,
          height: 50,
        });
      } else {
        firstPage.drawImage(signatureImage, {
          x: (firstPage.getWidth() * x) / pdfDimentions.width,
          y:
            firstPage.getHeight() -
            (firstPage.getHeight() * y) / pdfDimentions.height -
            25,
          width: 80,
          height: 50,
        });
      }

      const pdfBytes = await pdfDoc.save();
      const pdfBase64Original = _uint8ToBase64(pdfBytes);
      setNumOfPage(page);
      setBase64ModifyFile('data:application/pdf;base64,' + pdfBase64Original);
    }
  };

  return (
    <SafeAreaView style={styles.container(bottom)}>
      <Pdf
        minScale={1.0}
        maxScale={1.0}
        scale={1.0}
        usePDFKit={false}
        page={numOfPage}
        enablePaging={true}
        source={{
          uri: base64ModifyFile ? base64ModifyFile : base64InitFile,
          cache: true,
        }}
        onLoadComplete={(_numberOfPages, _filePath, {width, height}) =>
          setPdfDimentions({width, height})
        }
        onPageSingleTap={(page, x, y) => handleSingleTap(page, x, y)}
        onError={error => {
          console.log(error);
        }}
        style={styles.pdf(bottom)}
      />

      {isEditable ? (
        <>
          <CancelEditMode
            setIsEditable={setIsEditable}
            setBase64ModifyFile={setBase64ModifyFile}
          />
          <ConfirmEditMode
            setIsEditable={setIsEditable}
            setBase64InitFile={setBase64InitFile}
            base64ModifyFile={base64ModifyFile}
          />
          <BannerEditMode />
        </>
      ) : (
        <>
          <BackScreen />
          <OptionsSign
            setIsEditable={setIsEditable}
            signatureLocation={signatureLocation}
          />
        </>
      )}
    </SafeAreaView>
  );
};

export default PDFExample;

const styles = StyleSheet.create({
  container: bottom => ({
    backgroundColor: '#f2f2f2',
    marginBottom: bottom,
  }),
  pdf: bottom => ({
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height * 0.88 - bottom,
  }),
});
