import { Text, View } from 'react-native';
import MainWrapper from '../components/MainWrapper';
import ThemeText from '../components/theme/ThemeText';
import MinimalCard from '../components/card/MinimalCard';

export default function NotFoundScreen() {
  return (
    <MainWrapper>
      <View>
        <ThemeText>Not Found This Page</ThemeText>

        <View className='w-full h-[200px] border-4'>
          <MinimalCard
            style={{
            }}
            title='Bad Boys: Ride or Die'
            src={'https://image.tmdb.org/t/p/w342//oGythE98MYleE6mZlGs5oBGkux1.jpg'} />
        </View>

      </View>
    </MainWrapper>
  );
}
