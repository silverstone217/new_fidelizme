import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useLayoutEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { primary } from "../constants/Colors";
import { useUserStore } from "../lib/store";
import { UserType } from "../types";
import { getData } from "../utils/functions";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  const { setUser } = useUserStore();

  useEffect(() => {
    if (error) {
      console.error("Font loading error:", error);
      SplashScreen.hideAsync();
    }
  }, [error]);

  useLayoutEffect(() => {
    const loadData = async () => {
      try {
        const value = (await getData("user")) as UserType;
        setUser(value ?? null);
        // console.log("User loaded:", value);
      } catch (e) {
        console.error("Failed to load user:", e);
        setUser(null);
      }
    };
    loadData();
  }, [setUser]);

  useEffect(() => {
    if (loaded) {
      setTimeout(() => {
        SplashScreen.hideAsync();
      }, 500); // Réduisez le délai
    }
  }, [loaded]);

  if (!loaded) {
    // Affichez un écran de chargement
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={primary} />
      </View>
    );
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const { user } = useUserStore();

  return (
    <>
      <Stack initialRouteName={user ? "home" : "index"}>
        <Stack.Protected guard={user === null}>
          <Stack.Screen name="index" options={{ headerShown: false }} />
        </Stack.Protected>

        <Stack.Protected guard={user !== null}>
          <Stack.Screen
            name="home"
            options={{ headerShown: false, title: "Accueil" }}
          />
          <Stack.Screen
            name="profile"
            options={{ presentation: "modal", title: "Modifier votre Profile" }}
          />
        </Stack.Protected>
      </Stack>
      <StatusBar style="auto" animated />
    </>
  );
}
