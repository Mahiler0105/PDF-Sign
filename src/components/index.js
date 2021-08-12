import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {SKYBLUE, GREEN, BLUE} from '../theme/colors';
import {
  faSignature,
  faArrowLeft,
  faEdit,
  faCheck,
} from '@fortawesome/free-solid-svg-icons';

export const BannerEditMode = () => (
  <View style={styles.bannerEditMode}>
    <Text style={styles.bannerEditText}>* MODO EDICIÓN *</Text>
    <Text>Presiona donde quieres que vaya la firma</Text>
  </View>
);

export const CancelEditMode = ({setIsEditable, setFilePath}) => {
  return (
    <TouchableOpacity
      onPress={() => {
        setIsEditable(false);
        setFilePath(
          'https://firebasestorage.googleapis.com/v0/b/lrtbl-6858b.appspot.com/o/G%26S-RH-FO-02_REGISTRO%20DE%20INDUCCI%C3%93N%20G%26S_v01.pdf?alt=media&token=8f3402b1-590f-4ef9-9648-1cc5892cf7d1',
        );
      }}
      style={styles.cancelEditMode}>
      <Text style={styles.cancelEditText}>Salir</Text>
    </TouchableOpacity>
  );
};

export const ConfirmEditMode = ({setIsEditable}) => {
  return (
    <TouchableOpacity
      onPress={() => setIsEditable(false)}
      style={styles.confirmEditMode}>
      <FontAwesomeIcon icon={faCheck} size={20} color="white" />
    </TouchableOpacity>
  );
};

export const BackScreen = () => {
  return (
    <TouchableOpacity style={styles.backScreen}>
      <FontAwesomeIcon icon={faArrowLeft} size={20} color="white" />
    </TouchableOpacity>
  );
};

export const OptionsSign = ({setIsEditable, signatureLocation}) => {
  return (
    <View style={styles.optionsSign}>
      <TouchableOpacity
        onPress={() => setIsEditable(true)}
        style={[styles.optionsSignBtn, {backgroundColor: SKYBLUE}]}>
        <FontAwesomeIcon icon={faEdit} size={20} color="white" />
        <Text style={styles.optionsSignText}>Ubicar firma</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          console.log('==================================================');
          console.log('Enviando a firmar digitalmente:', signatureLocation);
          console.log('==================================================');
        }}
        style={[styles.optionsSignBtn, {backgroundColor: GREEN}]}>
        <FontAwesomeIcon icon={faSignature} size={20} color="white" />
        <Text style={styles.optionsSignText}>Firmar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bannerEditMode: {
    backgroundColor: '#fff88c',
    width: '100%',
    alignItems: 'center',
    paddingTop: 15,
    paddingBottom: 15,
  },
  bannerEditText: {
    fontWeight: 'bold',
  },
  cancelEditMode: {
    position: 'absolute',
    backgroundColor: BLUE,
    left: 20,
    borderRadius: 15,
    top: 20,
    padding: 7,
    paddingLeft: 12,
    paddingRight: 12,
  },
  confirmEditMode: {
    position: 'absolute',
    backgroundColor: GREEN,
    right: 20,
    borderRadius: 20,
    top: 20,
    padding: 7,
  },
  cancelEditText: {
    color: 'white',
    fontWeight: 'bold',
  },
  backScreen: {
    position: 'absolute',
    backgroundColor: BLUE,
    left: 20,
    borderRadius: 20,
    top: 20,
    padding: 8,
  },
  optionsSign: {
    width: '100%',
    flexDirection: 'row',
  },
  optionsSignText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
    marginLeft: 10,
  },
  optionsSignBtn: {
    paddingTop: 23,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 23,
    width: '50%',
  },
});
