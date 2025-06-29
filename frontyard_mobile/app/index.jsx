import { Link } from "expo-router";
import { Text, View, Image } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "blue",
      }}
    >
      <Text>testing</Text>
      <Link href={"/about"}>About</Link>
      <Image></Image>
    </View>
  );
}
