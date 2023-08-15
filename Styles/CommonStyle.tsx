import { StyleSheet } from 'react-native';

const Styles = StyleSheet.create
({
    mainBody :
    {
        flex: 1,
        justifyContent:"center",
        alignItems:"center",
    },
    contentsContainer :
    {
        flex: 1,
    },
    bannerContainer :
    {
        alignItems:'flex-start',
        width: 280,
        height: 210,
    },
    banner :
    {
        flex: 1,
        width: 280,
        height: 210,
        borderRadius: 36,
        borderColor: '#000000',
        borderWidth:2,
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
    },
    background:
    {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
    },
    logo:
    {
        flex:1,
        width: 210,
        height: 176,
    },
    title:
    {
        flex:1,
        fontSize:60,
        fontFamily:"TitleFont",
        textAlign: "center",
        letterSpacing: 0.84,
        color: "#424242",
        opacity: 1,
        top:12
    }
})

export default Styles