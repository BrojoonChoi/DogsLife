import { StyleSheet } from 'react-native';

const Styles = StyleSheet.create
({
    mainBody :
    {
        flex: 1,
        justifyContent : 'center',
        alignItems : 'center',
        flexDirection : 'column',
        backgroundColor : "#FFFFFF",
    },
    contentsContainer :
    {
        flex: 1,
    },
    contentsBigContainer :
    {
        flex: 2,
    },
    imageContainer :
    {
        borderRadius: 36,
        padding:8,
    },
    spacer:
    {
        flex:0.5,
    }
})

export default Styles