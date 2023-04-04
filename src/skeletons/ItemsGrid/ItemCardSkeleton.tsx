import React from 'react';
import ContentLoader from 'react-content-loader/native';
import { StyleSheet, View } from 'react-native';
import { Rect } from 'react-native-svg';

export const ItemCardSkeleton = () => {
  return (
    <View style={Styles.card}>
      <View style={Styles.spacing}>
        <View style={Styles.content}>
          <ContentLoader
            width={180}
            height={195}
            viewBox='0 0 180 195'
            backgroundColor='#f3f3f3'
            foregroundColor='#ecebeb'
          >
            <Rect x={120} y={8} rx={2} ry={2} width={40} height={14} />
            <Rect x={20} y={32} rx={2} ry={2} width={120} height={120} />
            <Rect x={20} y={170} rx={2} ry={2} width={120} height={14} />
          </ContentLoader>
        </View>
      </View>
    </View>
  );
};

const Styles = StyleSheet.create({
  spacing: {
    flex: 1,
    padding: 8
  },
  card: {
    width: 200,
    height: 232
  },
  content: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 12
  }
});
