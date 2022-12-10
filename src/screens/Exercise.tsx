import { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import { Box, Heading, HStack, Icon, Image, ScrollView, Text, VStack, useToast, Center, Skeleton } from "native-base";
import { Feather } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

import { appNavigatorRoutesProps } from "@routes/app.routes";

import { Button } from "@components/Button";
import { Loading } from "@components/Loading";

import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import defaultUserPhotoImg from '@assets/userPhotoDefault.png';

import { AppError } from '@utils/AppError';

import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

import { UserPhoto } from '@components/UserPhoto';

import { ExerciseDTO } from "@dtos/ExerciseDTO";
import { api } from "@services/api";
import { useAuth } from "@hooks/useAuth";

interface RouteParamsProps {
	exerciseId: string;
}

const PHOTO_SIZE= 33 ;

type FormDataProps = {
    name: string;
    email: string;
    password: string;
    old_password: string;
    confirm_password: string;
}

const profileSchema = yup.object({
    name: yup
        .string()
        .required('Informe o nome.'),
    password: yup
        .string()
        .min(6, 'A senha deve ter pelo menos 6 dígitos')
        .nullable()
        .transform((value) => !!value ? value : null),
    confirm_password: yup
        .string()
        .nullable()
        .transform((value) => !!value ? value : null)
        .oneOf([yup.ref('password'), null], 'A confirmação de senha não confere')
        .when('password', {
            is: (Field: any) => Field,
            then: yup
            .string()
            .nullable()
            .required('Informe a confirmação da senha')
            .transform((value) => !!value ? value : null), 
        })
});


export function Exercise() {
	const [isLoading, setIsLoading] = useState(false);
	const [sendRegister, setSendRegister] = useState(false);
	const [exercise, setExercise] = useState<ExerciseDTO>({} as ExerciseDTO);

	const navigation = useNavigation<appNavigatorRoutesProps>();

	const route = useRoute();

	const { exerciseId } = route.params as RouteParamsProps;

	const toast = useToast();

	function handleGoBack() {
		navigation.goBack();
	}

	async function fetchExerciseDetails() {
		try {
			setIsLoading(true);

			const response = await api.get(`/exercises/${exerciseId}`);

			setExercise(response.data);
		} catch (error) {
			const isAppError = error instanceof AppError;

			const title = isAppError
				? error.message
				: "Não foi possível carregar os detalhes do exercício.";

			toast.show({
				title,
				placement: "top",
				bgColor: "red.500"
			});
		} finally {
			setIsLoading(false);
		}
	}

	const [isUpdating, setIsUpdating] = useState(false);
    const [photoIsLoading, setPhotoIsLoading] = useState (false);
    const { user, updateUserProfile } = useAuth();    

	async function handleExerciseHistoryRegister() {
		try {
			setSendRegister(true);

			await api.post("/history", { exercise_id: exerciseId});			
			toast.show({
				title: "Parabéns! Exercício registrado no seu histórico.",
				placement: "top",
				bgColor: "green.700"
			});
			navigation.navigate("home");

		} catch (error) {
			const isAppError = error instanceof AppError;
			const title = isAppError ? error.message : "Não foi possível registrar o exercício.";

			toast.show({
				title,
				placement: "top",
				bgColor: "red.500"
			});
		} finally {
			setSendRegister(false);
		}
	}

	useEffect(() => {
		fetchExerciseDetails();
	}, [exerciseId]);



	async function handleUserPhotoSelect () {
        setPhotoIsLoading(true);

        try {
                const photoSelected = await ImagePicker.launchImageLibraryAsync( {
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 1,
                aspect: [4, 4],
                allowsEditing: true,
            });
            
            if (photoSelected.cancelled) {                
                return;
            }

            if (photoSelected.uri) {  
                const photoInfo = await FileSystem.getInfoAsync(photoSelected.uri);
                 
            if (photoInfo.size && (photoInfo.size /1024 / 1024) >5) {
                return toast.show({
                    title:'Essa imagem é muito grande! Por favor, escolha uma de até 5MB.',
                    placement: 'top',
                    bgColor:'red.600'                    
                    });                    
                }   const fileExtension = photoSelected.uri.split('.').pop();

                    const photoFile = {
                        name: `${user.name}.${fileExtension}`.toLowerCase(),
                        uri: photoSelected.uri,
                        type: `${photoSelected.type}/${fileExtension}`,
                    }   as any;          

                    const userPhotoUploadForm = new FormData();
                    userPhotoUploadForm.append('avatar', photoFile);

                   const avatarUpdatedResponse = await api.patch('/users/avatar', userPhotoUploadForm, {
                        headers:{
                            'Content-Type': 'multipart/form-data'
                        }                        
                    });
                        const userUpdated = user;
                        userUpdated.avatar = avatarUpdatedResponse.data.avatar;
                        updateUserProfile(userUpdated);                       

                        //console.log(userUpdated);
                    toast.show({
                        title: 'Foto Atualizada!',
                        placement:'top',                        
                        bgColor: 'green.500'
                    })

					navigation.navigate("home");
                }
        
            } catch (error) {
                //console.log(error);
                    } finally {
                        setPhotoIsLoading(false);
                }
            }  

	return (
		<VStack flex={1}>
			<VStack px={8} pt={12} bg="gray.600">
				<TouchableOpacity onPress={handleGoBack}>
					<Icon as={Feather} name="arrow-left" color="blue.100" size={6} />
				</TouchableOpacity>

				<HStack
					justifyContent="space-between"
					mt={8}
					mb={6}
					alignItems="center"
				>
					<Heading
						color="gray.200"
						fontSize="lg"
						fontFamily="heading"
						flex={1}
						textAlign='center'
					>
						Por favor, atualize a sua foto de perfil!
					</Heading>
				</HStack>
			</VStack>

			{isLoading ? (
				<Loading />
			) : (
				<ScrollView>
					<VStack p={8}>
						<Box rounded="lg" mb={3} overflow="hidden">
							<Center mt={6} px={10} >  
								{ photoIsLoading ?
									<Skeleton 
									w={PHOTO_SIZE}   
									h={PHOTO_SIZE}
									rounded="full"
									startColor="gray.600"
									endColor="gray.400"                            
									/> 
									:                           
									<UserPhoto 
										source={user.avatar ? { uri: `${api.defaults.baseURL}/avatar/${user.avatar}` } : defaultUserPhotoImg }
										alt="Imagem do usuário"
										size={PHOTO_SIZE}
									/>
									}                 									
								
							</Center>
						</Box>

						<Box pb={16} px={4} mt='48px'>						

							<Button
								title="Atualizar Foto"
								isLoading={sendRegister}
								onPress={handleUserPhotoSelect}
							/>
						</Box>
					</VStack>
				</ScrollView>
			)}
		</VStack>
	);
}
