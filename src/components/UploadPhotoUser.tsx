import { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { Center, ScrollView, VStack, Skeleton, Text, Heading, useToast } from 'native-base';

import { Controller, useForm } from 'react-hook-form';
import { useAuth } from '@hooks/useAuth';

import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import defaultUserPhotoImg from '@assets/userPhotoDefault.png';

import { api } from '@services/api';
import { AppError } from '@utils/AppError';

import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

import { ScreenHeader } from '@components/ScreenHeader';
import { UserPhoto } from '@components/UserPhoto';
import { Input } from '@components/Input';
import { Button } from '@components/Button';


const PHOTO_SIZE= 33 ;

export function UploadPhotoUser (){
    
}
    