import { Button as ButtonNativeBase, IButtonProps, Text } from "native-base";
import * as Icon from "phosphor-react-native";
import LogoSvg2 from '@assets/logo2.svg';


type Props = IButtonProps & {
    title:string;
    variant?: 'solid' | 'outline';
}

export function ButtonEditPhoto ({title, variant = 'solid', ...rest} : Props) {
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
            
        
        
        </ButtonNativeBase >
    );
}