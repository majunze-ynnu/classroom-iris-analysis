import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { Camera } from 'expo-camera';
import { Asset } from 'expo-asset';

// Get the asset for the HTML file
const htmlAsset = Asset.fromModule(require('@/assets/web/index.html'));

// Constants for attention analysis
const ATTENTION_THRESHOLD = 0.1; // This threshold may need tuning

export default function HomeScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [webViewUrl, setWebViewUrl] = useState<string | null>(null);
  const [attentionStatus, setAttentionStatus] = useState<string>('Initializing...');
  const baselineIrisDistance = useRef<number | null>(null);

  useEffect(() => {
    (async () => {
      // Request camera permission
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');

      // Get the local URI of the HTML file
      if (htmlAsset.uri) {
        setWebViewUrl(htmlAsset.uri);
      } else {
        await htmlAsset.downloadAsync();
        setWebViewUrl(htmlAsset.uri);
      }
    })();
  }, []);

  const analyzeAttention = (irisData: any) => {
    const { leftIris, rightIris } = irisData;

    if (!leftIris || !rightIris || leftIris.length < 5 || rightIris.length < 5) {
      return 'No face detected';
    }

    // Calculate the center of each iris
    const leftIrisCenter = leftIris.reduce((acc: any, lm: any) => ({ x: acc.x + lm.x, y: acc.y + lm.y }), { x: 0, y: 0 });
    leftIrisCenter.x /= leftIris.length;
    leftIrisCenter.y /= leftIris.length;

    const rightIrisCenter = rightIris.reduce((acc: any, lm: any) => ({ x: acc.x + lm.x, y: acc.y + lm.y }), { x: 0, y: 0 });
    rightIrisCenter.x /= rightIris.length;
    rightIrisCenter.y /= rightIris.length;

    // Calculate the horizontal distance between the irises
    const irisDistance = Math.abs(leftIrisCenter.x - rightIrisCenter.x);

    // Set a baseline distance
    if (baselineIrisDistance.current === null) {
      baselineIrisDistance.current = irisDistance;
      return 'Calibrating...';
    }

    // Compare the current distance to the baseline
    const deviation = Math.abs(irisDistance - baselineIrisDistance.current);

    if (deviation < ATTENTION_THRESHOLD) {
      return 'Attentive';
    } else {
      return 'Inattentive';
    }
  };

  const handleMessage = (event: any) => {
    const irisData = JSON.parse(event.nativeEvent.data);
    const status = analyzeAttention(irisData);
    setAttentionStatus(status);
  };

  if (hasPermission === null || webViewUrl === null) {
    return <View style={styles.centered}><Text>Loading...</Text></View>;
  }
  if (hasPermission === false) {
    return <View style={styles.centered}><Text>No access to camera</Text></View>;
  }

  return (
    <View style={styles.container}>
      <WebView
        style={styles.webview}
        source={{ uri: webViewUrl }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        onMessage={handleMessage}
      />
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>Attention Status: {attentionStatus}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusContainer: {
    padding: 20,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
