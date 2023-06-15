import React from 'react'
import { Helmet } from 'react-helmet'
import WhitepaperPdf from '../../assets/docs/whitepaper_v1.pdf'

function Whitepaper() {

    return (
        <div className='docs-container'>
            <Helmet>
                <title>Whitepaper | Agritech</title>
            </Helmet>
            <div class='embed-responsive'>
                <object data={WhitepaperPdf} type="application/pdf" className='w-100' height={window.innerHeight - 100}>
                    {/* <p>Unable to display PDF file. <a href="/uploads/media/default/0001/01/540cb75550adf33f281f29132dddd14fded85bfc.pdf">Download</a> instead.</p> */}
                </object>
            </div>
        </div>
    )
}

export default Whitepaper