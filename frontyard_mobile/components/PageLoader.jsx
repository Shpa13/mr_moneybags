import { View, ActivityIndicator } from "react-native";
import { styles } from "../assets/styles/auth.styles";
import { COLORS } from "../constants/colors";

const PageLoader = () => {
  return (
    <View syle={styles.loadingContainer}>
      <ActivityIndicator size="large" color={COLORS.Primary} />
    </View>
  );
};
export default PageLoader;
