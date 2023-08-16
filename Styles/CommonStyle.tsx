import { StyleSheet } from 'react-native';

const Styles = StyleSheet.create
({
    mainBody :
    {
        flex: 1,
        alignItems:"center",
    },
    footer:
    {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFF2F4',
        width:"100%",
        height:58,
        shadowOffset: { width: 0, height: -13 }, // 그림자 위치 (가로, 세로)
        shadowOpacity:5,
        shadowRadius: 50 // 그림자 반경
    },
    contentsContainer :
    {
        flex: 1,
    },
    bannerContainer :
    {
        alignItems:"center", 
        justifyContent:"center",
    },
    banner :
    {
        flex: 1,
        width: 348,
        height: 120,
        borderRadius: 16,
        borderColor: '#FFCFD5',
        borderWidth:1
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
        top:12,
    },
    loginButton:
    {
        width: 342,
        height: 54,
        opacity: 1,
        borderRadius: 6,
        backgroundColor: "#FFFFFF",
        marginVertical:5,
        justifyContent:"center",
    },
    loginButtonKakao:
    {
        width: 342,
        height: 54,
        opacity: 1,
        borderRadius: 6,
        backgroundColor: "#FFE600",
        marginVertical:5,
        justifyContent:"center",
    },
    loginButtonText:
    {
        textAlignVertical:'center',
        letterSpacing:0,
        fontSize:19,
        textAlign:'center',
        color:"#000000",
        fontWeight:"600",
    }
})

export default Styles