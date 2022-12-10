import { useState } from "react";
import {
	VStack,	
	Text,
	Center,	
	ScrollView,
	useToast,
	ZStack,	
} from "native-base";
import { useNavigation } from "@react-navigation/native";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { AuthNavigatorRoutesProps } from "@routes/auth.routes";

import { useAuth } from "@hooks/useAuth";

import { AppError } from "@utils/AppError";

import { Input} from "@components/Input";
import { Button } from "@components/Button";

import LogoSvg from "@assets/logo.svg";


type FormDataProps = {
	email: string;
	password: string;
};

const signInSchema = yup.object({
	email: yup.string().required("Informe o e-mail.").email("E-mail inválido."),
	password: yup
		.string()
		.required("Informe a senha.")
		.min(6, "A senha deve ter pelo menos 6 dígitos.")
});

export function SignIn() {
	const [isLoading, setIsLoading] = useState(false);

	const { signIn } = useAuth();

	const navigation = useNavigation<AuthNavigatorRoutesProps>();

	const toast = useToast();

	const {
		control,
		handleSubmit,
		formState: { errors }
	} = useForm<FormDataProps>({
		resolver: yupResolver(signInSchema),
		defaultValues: {
			email: "",
			password: ""			
			
		}
	});

	async function handleSignIn({ email, password }: FormDataProps) {
		try {
			setIsLoading(true);

			await signIn(email, password);
		} catch (error) {
			const isAppError = error instanceof AppError;

			const title = isAppError
				? error.message
				: "Não foi possível entrar. Tente novamente mais tarde.";

			setIsLoading(false);

			toast.show({
				title,
				placement: "top",
				bgColor: "red.500"
			});
		}
	}

	function handleNewAccount() {
		navigation.navigate("signUp");
	}

	return (
		<ScrollView
			contentContainerStyle={{
				flexGrow: 1
			}}
			showsVerticalScrollIndicator={false}
		>
			<VStack flex={1} >	
							
				
				<ZStack bgColor="gray.600" w="full" h='650px' flex={1} rounded={8} alignItems="center" justifyContent="center">

					<VStack flex={1} w='320px'>
						
						<Center mb="20px">
							<LogoSvg />
							<Text color="gray.100" fontSize="sm">Seu espaço de compra e venda</Text>
						</Center>
						
						<Center flex={1} mt="12" >
							<Text color="gray.100" fontSize="sm" mb={4} fontFamily="mono">
								Acesse sua conta
							</Text>

							<Controller
								control={control}
								name="email"																		
								render={({ field: { value, onChange } }) => (
									<Input
										placeholder="E-mail"								
										keyboardType="email-address"
										autoCapitalize="none"
										onChangeText={onChange}
										value={value}
										errorMessage={errors.email?.message}
									/>
								)}
							/>
							<Controller
								control={control}
								name="password"
								render={({ field: { value, onChange } }) => (
									<Input
										placeholder="Senha"
										secureTextEntry
										onChangeText={onChange}
										value={value}								
										onSubmitEditing={handleSubmit(handleSignIn)}
										returnKeyType="send"
										errorMessage={errors.password?.message}
																		
									/>
								)}
							/>

							<Button
								title="Entrar"
								onPress={handleSubmit(handleSignIn)}
								isLoading={isLoading}
								marginTop={6}
							/>
						</Center>			
					</VStack>					
				</ZStack>	

				<Center mt={12}>
					<Text color="gray.100" fontSize="sm" mb={3} fontFamily="body">
							Ainda não tem acesso?
					</Text>						
				</Center>	

				<Center>
					<VStack flex={1} mb={12} w='320px'
					>
						<Button
								title="Criar conta"
								variant="outline"
								onPress={handleNewAccount}
							/>
					</VStack>	
				</Center>
							
			</VStack>
		</ScrollView>
	);
}
