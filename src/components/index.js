import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {SKYBLUE, GREEN} from '../theme/colors';
import {
  faSignature,
  faArrowLeft,
  faEdit,
  faCheck,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';

export const CancelEditMode = ({setIsEditable, setBase64ModifyFile}) => {
  return (
    <TouchableOpacity
      onPress={() => {
        setIsEditable(false);
        setBase64ModifyFile(null);
      }}>
      <FontAwesomeIcon icon={faTimes} size={18} color="#8e1600" />
    </TouchableOpacity>
  );
};

export const ConfirmEditMode = ({setIsEditable}) => {
  return (
    <TouchableOpacity onPress={() => setIsEditable(false)}>
      <FontAwesomeIcon icon={faCheck} size={18} color={GREEN} />
    </TouchableOpacity>
  );
};

export const BackScreen = () => {
  return (
    <TouchableOpacity>
      <FontAwesomeIcon icon={faArrowLeft} size={18} color="white" />
    </TouchableOpacity>
  );
};

export const BannerEditMode = () => (
  <View style={styles.bannerEditMode}>
    <Text style={styles.bannerEditText}>* MODO EDICIÓN *</Text>
    <Text>Presiona donde quieres que vaya la firma</Text>
  </View>
);

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
    height: 70,
    alignItems: 'center',
    paddingTop: 15,
    paddingBottom: 15,
  },
  bannerEditText: {
    fontWeight: 'bold',
  },
  cancelEditText: {
    color: 'white',
    fontWeight: 'bold',
  },
  optionsSign: {
    width: '100%',
    flexDirection: 'row',
    backgroundColor: '#fff',
    height: 70,
    paddingBottom: 20,
  },
  optionsSignText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
    marginLeft: 10,
  },
  optionsSignBtn: {
    height: 70,
    paddingTop: 23,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 23,
    marginBottom: 30,
    width: '50%',
  },
});
