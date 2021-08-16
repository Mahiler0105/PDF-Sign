import React from 'react';
import {StyleSheet, Dimensions, Platform} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import Pdf from 'react-native-pdf';
const RNFS = require('react-native-fs');
import {PDFDocument} from 'pdf-lib';
import {_base64ToArrayBuffer, _uint8ToBase64} from './utils/convertBase64';
import {
  BackScreen,
  OptionsSign,
  CancelEditMode,
  ConfirmEditMode,
  BannerEditMode,
} from './components';

const URL_PDF_FILE =
  'https://firebasestorage.googleapis.com/v0/b/lrtbl-6858b.appspot.com/o/G%26S-RH-FO-02_REGISTRO%20DE%20INDUCCI%C3%93N%20G%26S_v01.pdf?alt=media&token=8f3402b1-590f-4ef9-9648-1cc5892cf7d1';
const URL_SIGN_FILE =
  'https://firebasestorage.googleapis.com/v0/b/lrtbl-6858b.appspot.com/o/CamScanner%2006-20-2021%2021.00-20210721-17.48.25.pdf?alt=media&token=2b8e65f0-fafa-49e0-a622-af379fd65544';

const get_url_extension = url => {
  return url
    .split(/[#?]/)[0]
    .split('.')
    .pop()
    .trim();
};

const PDFExample = () => {
  const {bottom} = useSafeAreaInsets();

  const [isEditable, setIsEditable] = React.useState(false);
  const [pdfDimentions, setPdfDimentions] = React.useState({
    width: 0,
    height: 0,
  });
  const [signatureLocation, setSignatureLocation] = React.useState({
    page: 0,
    x: 0,
    y: 0,
  });
  const [filePath, setFilePath] = React.useState(URL_PDF_FILE);
  const [pdfArrayBuffer, setPDFArrayBuffer] = React.useState(null);
  const [pdfBase64, setPdfBase64] = React.useState(null);
  const [signatureBase64, setSignatureBase64] = React.useState(null);
  const [signatureArrayBuffer, setSignatureArrayBuffer] = React.useState(null);
  const [newPdfSaved, setNewPdfSaved] = React.useState(false);

  const handleSingleTap = async (page, x, y) => {
    if (isEditable) {
      setSignatureLocation({page, x, y});
      const date = new Date();
      const fileTitle = `footloose_${Math.floor(
        date.getTime() + date.getSeconds() / 2,
      )}.${get_url_extension(URL_PDF_FILE)}`;

      RNFS.downloadFile({
        fromUrl: URL_PDF_FILE,
        toFile: `${RNFS.DocumentDirectoryPath}/${fileTitle}`,
      })
        .promise.then(_res => {
          RNFS.readFile(
            `${RNFS.DocumentDirectoryPath}/${fileTitle}`,
            'base64',
          ).then(contents => {
            setPdfBase64(contents);
            setPDFArrayBuffer(_base64ToArrayBuffer(contents));
          });
        })
        .catch(err => console.log(err));

      const signatureUrl =
        'https://firebasestorage.googleapis.com/v0/b/lrtbl-6858b.appspot.com/o/firma_fer-removebg-preview.png?alt=media&token=ecb4c0a0-6c50-48b1-af5d-c8f2d880bc5b';
      const fileTitle2 = `footloose_${Math.floor(
        date.getTime() + date.getSeconds() / 2,
      )}.${get_url_extension(signatureUrl)}`;

      RNFS.downloadFile({
        fromUrl: signatureUrl,
        toFile: `${RNFS.DocumentDirectoryPath}/${fileTitle2}`,
      })
        .promise.then(_res => {
          RNFS.readFile(
            `${RNFS.DocumentDirectoryPath}/${fileTitle2}`,
            'base64',
          ).then(contents => {
            setSignatureBase64(contents);
            setSignatureArrayBuffer(_base64ToArrayBuffer(contents));
          });
        })
        .catch(err => console.log(err));
      const pdfDoc = await PDFDocument.load(pdfArrayBuffer);
      const pages = pdfDoc.getPages();
      const firstPage = pages[page - 1];
      // The meat
      const signatureImage = await pdfDoc.embedPng(signatureArrayBuffer);
      if (Platform.OS === 'ios') {
        firstPage.drawImage(signatureImage, {
          x: (pdfDimentions.width * (x - 12)) / Dimensions.get('window').width,
          y: pdfDimentions.height - (pdfDimentions.height * (y + 12)) / 540,
          width: 50,
          height: 50,
        });
      } else {
        firstPage.drawImage(signatureImage, {
          x: (firstPage.getWidth() * x) / pdfDimentions.width,
          y:
            firstPage.getHeight() -
            (firstPage.getHeight() * y) / pdfDimentions.height -
            25,
          width: 50,
          height: 50,
        });
      }
      // Play with these values as every project has different requirements
      const pdfBytes = await pdfDoc.save();
      const pdfBase64Original = _uint8ToBase64(pdfBytes);
      const path = `${
        RNFS.DocumentDirectoryPath
      }/react-native_signed_${Date.now()}.pdf`;

      RNFS.writeFile(path, pdfBase64Original, 'base64')
        .then(success => {
          setFilePath(path);
          setNewPdfSaved(true);
          setPdfBase64(pdfBase64Original);
        })
        .catch(err => {
          console.log(err.message);
        });
    }
  };

  return (
    <SafeAreaView style={styles.container(bottom)}>
      <Pdf
        source={{uri: filePath, cache: true}}
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
            setFilePath={setFilePath}
          />
          <ConfirmEditMode setIsEditable={setIsEditable} />
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
