

useEffect(() => {
  const backAction = () => {
    // Close the app immediately when back is pressed on home screen
    BackHandler.exitApp();
    return true; // Prevent default back action
  };

  const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

  return () => backHandler.remove();
}, []);