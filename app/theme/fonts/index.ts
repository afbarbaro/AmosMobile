import * as Font from "expo-font"
import { AntDesign, Ionicons } from "@expo/vector-icons"

export const initFonts = async () => {
  // Refer to ./assets/fonts/custom-fonts.md for instructions.
  // ...
  // Welcome back! Just uncomment this and replace/append with your font file names!
  // ⬇
  await Promise.all([Font.loadAsync(AntDesign.font), Font.loadAsync(Ionicons.font)])
}
