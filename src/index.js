import React from 'react';
import {StyleSheet, Dimensions, Platform, View, Text} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Pdf from 'react-native-pdf';
import {Header} from 'react-native-elements';
import {BLUE} from './theme/colors';
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
  const [pagination, setPagination] = React.useState({total: 0, actual: 0});

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
        firstPage.drawImage(signatureImage, {
          x: (pdfDimentions.width * x - 12) / Dimensions.get('window').width,
          y: pdfDimentions.height - (pdfDimentions.height * (y + 12)) / 540,
          width: 80,
          height: 50,
        });
      } else {
        firstPage.drawImage(signatureImage, {
          x: (firstPage.getWidth() * x) / pdfDimentions.width - 40,
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
    <View style={styles.container(bottom)}>
      <Header
        statusBarProps={{backgroundColor: BLUE}}
        barStyle="light-content"
        containerStyle={styles.containerHeader}>
        {isEditable ? (
          <CancelEditMode
            setIsEditable={setIsEditable}
            setBase64ModifyFile={setBase64ModifyFile}
          />
        ) : (
          <BackScreen />
        )}
        <Text style={styles.titleHeader}>Formato de Inducción G&S</Text>
        {isEditable && (
          <ConfirmEditMode
            setIsEditable={setIsEditable}
            setBase64InitFile={setBase64InitFile}
            base64ModifyFile={base64ModifyFile}
          />
        )}
      </Header>
      {pdfDimentions.width !== 0 && (
        <View style={styles.paginationContainer}>
          <View style={styles.paginationView}>
            <Text style={styles.paginationText}>
              {pagination.actual} de {pagination.total}
            </Text>
          </View>
        </View>
      )}
      <View style={styles.container(bottom)}>
        <Pdf
          minScale={1.0}
          maxScale={isEditable ? 1.0 : 3.0}
          scale={1.0}
          usePDFKit={false}
          page={numOfPage}
          style={styles.pdf}
          enablePaging={true}
          source={{
            uri: base64ModifyFile ? base64ModifyFile : base64InitFile,
            cache: true,
          }}
          onLoadComplete={(numberOfPages, _filePath, {width, height}) => {
            setPdfDimentions({width, height});
            setPagination({total: numberOfPages, actual: 1});
          }}
          onPageChanged={page => setPagination({...pagination, actual: page})}
          onPageSingleTap={(page, x, y) => handleSingleTap(page, x, y)}
          onError={error => {
            console.log(error);
          }}
        />
      </View>
      {isEditable ? (
        <BannerEditMode />
      ) : (
        <OptionsSign
          setIsEditable={setIsEditable}
          signatureLocation={signatureLocation}
        />
      )}
    </View>
  );
};

export default PDFExample;

const styles = StyleSheet.create({
  container: bottom => ({
    flex: 1,
    backgroundColor: '#f2f2f2',
    justifyContent: 'center',
    marginBottom: bottom,
  }),
  pdf: {
    backgroundColor: '#f2f2f2',
    width: Dimensions.get('window').width,
    height: 540,
  },
  containerHeader: {
    paddingBottom: 15,
    backgroundColor: BLUE,
    paddingTop: 20,
  },
  titleHeader: {
    color: '#fff',
  },
  paginationContainer: {
    alignItems: 'flex-end',
    marginTop: 10,
    paddingRight: 15,
  },
  paginationView: {
    backgroundColor: '#aab2b1',
    borderRadius: 15,
    paddingLeft: 7,
    paddingRight: 7,
    paddingTop: 2,
    paddingBottom: 2,
  },
  paginationText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
});
