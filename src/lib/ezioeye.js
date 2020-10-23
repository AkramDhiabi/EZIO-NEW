function hexStringToString(hexString) {

    hexString = hexString.toLowerCase();
    var result = "";


    for ( var i = 0 ; i < hexString.length ; i+=2 ) {
        var aByte = hexString.substr(i, 2);
        result = result + String.fromCharCode(parseInt(aByte, 16));
    }

    return result;

}

function draw_qrcode(text, version, ECL) {
    try {

    var qrVersion;
    if (version > 0)
    {
        qrVersion = version;
    }
    else
    {
        qrVersion = 7;
    }
    var qr;
    switch(ECL)
    {
        case "M":
            qr = new QRCode(qrVersion, QRErrorCorrectLevel.M);
        break;
        case "Q":
            qr = new QRCode(qrVersion, QRErrorCorrectLevel.Q);
        break;
        case "H":
            qr = new QRCode(qrVersion, QRErrorCorrectLevel.H);
        break;
        case "L":
        default:
            qr = new QRCode(qrVersion, QRErrorCorrectLevel.L);
    }

    qr.addData(text);

    qr.make();

    var qrCode = "<table style='width:3em; height: 3em; border-width: 0px; border-style: none; border-color: #0000ff; border-collapse: collapse;'>";

    for (var r = 0; r < qr.getModuleCount(); r++) {

        qrCode += "<tr>";

        for (var c = 0; c < qr.getModuleCount(); c++) {

            if (qr.isDark(r, c) ) {
                qrCode += "<td style='border-width: 0px; border-style: none; border-color: #0000ff; border-collapse: collapse; padding: 0; margin: 0; width: 3px; height: 3px; background-color: #000000;'/>";
            } else {
                qrCode += "<td style='border-width: 0px; border-style: none; border-color: #0000ff; border-collapse: collapse; padding: 0; margin: 0; width: 3px; height: 3px; background-color: #ffffff;'/>";
            }
        }

        qrCode += "</tr>";

    }
    qrCode += "</table>";
    document.getElementById("qrcodediv").innerHTML = qrCode;

    } catch (e) {
        if (e.message.lastIndexOf("code length overflow", 0) === 0) {
         alert("The version you have selected is to low to handle the amount of data supplied. Please select a higher version.");
        } else {
         alert(e);
        }
    }
}
