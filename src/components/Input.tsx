import { Input as NativeBaseInput, IInputProps, FormControl } from "native-base";

type Props = IInputProps & { 
    errorMessage?: string | null;
};

export function Input ({ errorMessage = null, isInvalid, ...rest} : Props ) {
const invalid = !! errorMessage || isInvalid;

    return (
        <FormControl isInvalid={invalid} mb={4}>
            <NativeBaseInput 
                bg="gray.700"
                h={14}
                px={4}
                borderWidth={0}
                fontSize="md"
                color="blue.100"
                fontFamily="body"               
                
                                
                {...rest}
                
                placeholderTextColor="gray.300"
                isInvalid={invalid}
                _invalid={{
                    borderWidth: 2,
                    borderColor:"red.600"
                                        
                }}
                _focus={
                    {
                        bg:"gray.700",
                        borderWidth: 1,
                        borderColor:"blue.100",
                        selectionColor:'blue.100',                        

                    }
                }
                />
                
                <FormControl.ErrorMessage>
                    {errorMessage}
                </FormControl.ErrorMessage>
        </FormControl>        
    );
}