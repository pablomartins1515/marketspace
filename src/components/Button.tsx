import { Button as ButtonNativeBase, IButtonProps, Text } from "native-base";

type Props = IButtonProps & {
    title:string;
    variant?: 'solid' | 'outline';
}

export function Button ({title, variant = 'solid', ...rest} : Props) {
    return (
        <ButtonNativeBase 
            w="full"
            h={14}
            bg={variant === "outline" ? "transparent" : "blue.100"}
            borderWidth={variant ==="outline" ? 1 : 0}
            borderColor="blue.100"
            {...rest}
            rounded="sm"
            _pressed={{
                bg: variant === "outline" ? "gray.600" : "lightBlue.500"
             }          
            }
            {...rest}
           >
            
            <Text
                color={variant === "outline" ? "blue.100" : "white"}
                fontFamily="heading"
                fontSize="sm"
           >

                {title}
            </Text>
        
        </ButtonNativeBase >
    );
}