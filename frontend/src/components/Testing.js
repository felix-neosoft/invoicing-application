import React from 'react'
import {Document, Page, Text, View, StyleSheet, PDFViewer } from '@react-pdf/renderer'
import { sendDocument } from '../config/NodeServices'



//create style
const styles = StyleSheet.create({
    Document:{
        width:'500px',
        height:'500px'
    },
    page:{
        flexDirection:'row',
        backgroundColor:'#E4E4E4'
    },
    section:{
        margin:10,
        padding:10,
        flexGrow:1
    }
})

//const Document
const MyDocument = () => (
    <Document style={styles.Document}>
        <Page size="A4" style={styles.page}>
            <View style={styles.section}>
                <Text>Section #1</Text>
            </View>
            <View style={styles.section}>
                <Text>Section #2</Text>
            </View>

        </Page>
    </Document>
)

const sendingPDf = () =>{
    let formData = new FormData
    console.log(MyDocument)
    formData.append('pdfdata',MyDocument)
    sendDocument({"pdfdata":MyDocument}).then(res =>{
        if(res.data.err===1) alert(res.data.msg)
        else alert(res.data.msg)
    })
}


function Testing() {
    return (
        <div>
            <PDFViewer width="1000" height="500">
                <MyDocument />
            </PDFViewer>
            <button onClick={sendingPDf}>Click me</button>
        </div>
        
    )
}

export default Testing
