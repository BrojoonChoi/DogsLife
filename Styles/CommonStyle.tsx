import { StyleSheet } from 'react-native';

const Styles = StyleSheet.create
({
    mainBody :
    {
        flex: 1,
        alignItems:"center",
        width:"100%",
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
        flexDirection:"row",
        justifyContent:"space-between"
    },
    bannerContainer :
    {
        alignItems:"center", 
        justifyContent:"center",
        width: "100%",
        height: 120,
        marginBottom:48,
    },
    banner :
    {
        alignItems:"center", 
        justifyContent:"center",
        flex: 1,
        width: 384,
        height: "auto",
        borderRadius: 16,
        borderColor: '#FFCFD5',
        borderWidth:1,
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
    },
    leftRightPadding :
    {
        paddingLeft:21,
        paddingRight:21,
    },
    viewMoreButton :
    {   
        height:46,
        backgroundColor : "#FE8291",
        borderRadius: 16,
        justifyContent:"center",
        alignItems:"center",
        marginLeft:21,
        marginRight:21,
    },
    viewMoreButtonText :
    {
        textAlign:'center',
        textAlignVertical:'center',
        color : "#FFFFFF",
        fontFamily:"Cafe24Syongsyong",
        fontSize:19,
        letterSpacing:0.34,
    },
    camButton :
    {   
        width: 68,
        height: 34,
        backgroundColor : "#FFF2F4",
        borderRadius: 21,
        borderColor:"#FF7381",
        borderWidth:1,
        justifyContent:"center",
        alignItems:"center",
        marginLeft:14
    },
    camButtonText :
    {
        textAlign:'center',
        textAlignVertical:'center',
        color : "#FF7381",
        fontFamily:"BMJUA_ttf",
        fontSize:13,
        letterSpacing:-0.13,
    },
    camImage :
    {
        borderRadius: 12,
        borderColor:"#FFCFD5",
        borderWidth:1,
        width:146,
        height:146,
    },
    timeLine :
    {
        backgroundColor : "#FFF7F9",
        marginLeft:21,
        marginRight:21,
        padding:10,
        borderRadius: 16,
        borderColor:"#FFCFD5",
        borderWidth:1,
        marginBottom:16,
    },
    modalBackground :
    {
        backgroundColor :"#000000B3",
        flex:1,
    },
    modalPopup :
    {
        backgroundColor :"#FAFAFA",
        borderRadius:16,
        height:223,
        width:"100%"    ,
    },
    modalTitle :
    {
        paddingTop:48,
        textAlign:'center',
        textAlignVertical:'center',
        color : "#FF99A0",
        fontFamily:"BMJUA_ttf",
        fontSize:24,
        letterSpacing:-0.36,
        paddingBottom:6,
    },
    modalText :
    {
        textAlign:'center',
        textAlignVertical:'center',
        color : "#616161",
        fontFamily:"AppleSDGothicNeoM",
        fontSize:15,
        letterSpacing:-0.39,
        paddingBottom:26,
    },
    modalBtnOK :
    {
        width:128,
        height:48,
        backgroundColor:"#FE8291",
        borderRadius:24,
        color : "#FE8291",
        alignItems:"center",
        justifyContent:"center",
        margin:5,
    },
    modalBtnCancel :
    {
        width:128,
        height:48,
        backgroundColor:"#EEEEEE",
        borderRadius:24,
        color : "#616161",
        alignItems:"center",
        justifyContent:"center",
        margin:5,
    },
    modalTextBox : {
        textAlign:'center',
        textAlignVertical:'center',
        fontFamily:"AppleSDGothicNeoM",
        fontSize:16,
        letterSpacing:0.31,
        borderRadius: 16,
        borderColor:"#FFCFD5",
        borderWidth:1,
        width:48,
        height:48,
        margin:4,
    },
    btnText :
    {
        textAlign:'center',
        textAlignVertical:'center',
        fontFamily:"AppleSDGothicNeoM",
        fontSize:17,
        letterSpacing:0.31,
    }
})

export default Styles