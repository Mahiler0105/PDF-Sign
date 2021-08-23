import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {SKYBLUE, GREEN, BLUE} from '../theme/colors';
import {useStatusBar} from '../hook/useStatusBar';
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

export const CancelEditMode = ({setIsEditable, setBase64ModifyFile}) => {
  const {height} = useStatusBar();
  return (
    <TouchableOpacity
      onPress={() => {
        setIsEditable(false);
        setBase64ModifyFile(null);
      }}
      style={styles.cancelEditMode(height)}>
      <Text style={styles.cancelEditText}>Salir</Text>
    </TouchableOpacity>
  );
};

export const ConfirmEditMode = ({setIsEditable}) => {
  const {height} = useStatusBar();
  return (
    <TouchableOpacity
      onPress={() => setIsEditable(false)}
      style={styles.confirmEditMode(height)}>
      <FontAwesomeIcon icon={faCheck} size={20} color="white" />
    </TouchableOpacity>
  );
};

export const BackScreen = () => {
  const {height} = useStatusBar();
  return (
    <TouchableOpacity style={styles.backScreen(height)}>
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
  cancelEditMode: height => ({
    position: 'absolute',
    backgroundColor: BLUE,
    left: 20,
    borderRadius: 15,
    top: height + 20,
    padding: 7,
    paddingLeft: 12,
    paddingRight: 12,
  }),
  confirmEditMode: height => ({
    position: 'absolute',
    backgroundColor: GREEN,
    right: 20,
    borderRadius: 20,
    top: height + 20,
    padding: 7,
  }),
  cancelEditText: {
    color: 'white',
    fontWeight: 'bold',
  },
  backScreen: height => ({
    position: 'absolute',
    backgroundColor: BLUE,
    left: 20,
    borderRadius: 20,
    top: height + 20,
    padding: 8,
  }),
  optionsSign: {
    width: '100%',
    flexDirection: 'row',
    paddingBottom: 20,
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
    marginBottom: 30,
    width: '50%',
  },
});
