import React, { useState } from 'react';

import defaultUserPhotoImg from '@assets/userPhotoDefault.png';
import { UserPhoto } from '@components/UserPhoto';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';


//import { useState } from "react";
import { useNavigation } from "@react-navigation/native"
import { VStack, Center, Text, Heading, ScrollView, useToast} from "native-base";
import { useForm, Controller } from 'react-hook-form';
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';

import { useAuth } from "@hooks/useAuth";
import { api } from '@services/api';

import LogoSvg2 from '@assets/logo2.svg';

import { AppError } from '@utils/AppError';

import { Input } from "@components/Input";
import { Button } from "@components/Button";


type FormDataProps = { 
    name: string;
    email: string;
    tel: string;
    password: string;
    password_confirm: string;
    avatar: string;
}

const signUpSchema = yup.object({
    name: yup.string().required('Informe o nome.'),
    email: yup.string().required('Informe o e-mail.').email('E-mail inválido.'),
    tel: yup.string().required('Informe o Telefone.').min(14,"Exemplo: +5599984574733"),
    password: yup.string().required('Informe a senha.').min(6," A senha deve ter pelo menos 6 dígitos."),
    password_confirm: yup.string().required('Confirme a senha.').oneOf([yup.ref('password'), null], 'A confirmação da senha não confere.'),
    //avatar: yup.string().required(" É obrigatório o envio de uma imagem."),

})

export function SignUp () {
    const [isLoading, setIsloading ] = useState(false);

    const toast = useToast();
    const {signIn} = useAuth();   
    const { user} = useAuth();

    const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>({
        defaultValues:{
            name: user.name,
            email: user.email,
            tel: user.tel,
            //avatar: user.avatar,
        },
        resolver: yupResolver(signUpSchema)
    });

    const navigation = useNavigation();

    function handleGoBack() {
        navigation.goBack ();
    };

    async function handleSignUp({name, email, password, tel}: FormDataProps){
       try {
        await api.post('/users', { name, email, password, tel});
        await signIn(email, password);

       } catch (error) {
            setIsloading(false);

        const isAppError = error instanceof AppError;
        const title = isAppError ? error.message : 'Não foi possível criar conta. Por favor, tente mais tarde.';
         toast.show({
            title, 
            placement: 'top',
            bgColor: 'red.600',
         });
        }
       }
       
    return (        
        <ScrollView contentContainerStyle={{flexGrow: 1}} showsHorizontalScrollIndicator={false}> 
            <VStack flex={1} px={10} pb={8} bgColor='gray.600'>
            
                <Center my={10} flex={1}>                 
                    <LogoSvg2 />
                    <Text color={"gray.100"} fontSize={"sm"} textAlign='center' >Crie sua conta e use o espaço para comprar itens variados e vender seus produtos</Text>
                </Center>

                <Center>
                   
                </Center>
              

                <Center>
                    <Text color="gray.100" fontSize="md" mb={4} fontFamily="body">
                        Crie sua conta
                    </Text>

                    <Controller 
                        control={control}
                        name="name"                        
                        render={({ field: { onChange, value }}) => (
                            <Input 
                                placeholder="Nome"
                                onChangeText={onChange}
                                value={value}
                                errorMessage={errors.name?.message}                                
                            />  
                        )}                         
                    />
              
                    <Controller 
                        control={control}
                        name="email"                      
                        render={({ field: { onChange, value }}) => (
                            <Input 
                                placeholder="E-mail"
                                keyboardType="email-address"
                                onChangeText={onChange}
                                value={value}
                                errorMessage={errors.email?.message}
                            />  
                        )}                         
                    />
                    <Controller 
                        control={control}
                        name="tel"                        
                        render={({ field: { onChange, value }}) => (
                            <Input 
                                placeholder="Telefone"                                
                                onChangeText={onChange}
                                value={value}
                                errorMessage={errors.tel?.message}                                
                            />  
                        )}                         
                    />
                   
                  <Controller 
                        control={control}
                        name="password"                        
                        render={({ field: { onChange, value }}) => (
                            <Input 
                                placeholder="Senha"
                                secureTextEntry={true}
                                onChangeText={onChange}
                                value={value}
                                errorMessage={errors.password?.message}                                
                            />  
                        )}                         
                    />

                    <Controller 
                        control={control}
                        name="password_confirm"
                        render={({ field: { onChange, value }}) => (
                            <Input 
                                placeholder="Confirme a senha"
                                secureTextEntry={true}
                                onChangeText={onChange}
                                value={value}
                                errorMessage={errors.password_confirm?.message}
                                onSubmitEditing={handleSubmit(handleSignUp)}
                                returnKeyLabel="send"
                                
                            />  
                        )}                         
                    />                                        
                    
                    <Button title="Criar e acessar"
                            onPress={handleSubmit(handleSignUp)}
                            isLoading={isLoading}
                            />
                </Center>           

               
                <Button 
                    title="Voltar para o login" 
                    variant={"outline"}
                    mt={24}
                    onPress={handleGoBack}
                    _pressed={{
                        bg:"gray.700"
                     }}                                                    
                />               
            
               
            </VStack>
        </ScrollView>            
    );
}



