/**
 *
 */

import { Appearance } from "react-native"
import { systemColorScheme } from "react-native-css-interop/dist/runtime/native/appearance-observables"

Appearance.addChangeListener(({ colorScheme }) => systemColorScheme.set(colorScheme ?? "light"))
