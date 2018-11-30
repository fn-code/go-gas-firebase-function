const functions = require('firebase-functions');
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);

exports.cekStok = functions.database.ref("Jenis/{pushId}").onUpdate(function(event) {
    
    var data = event.data.val();

    var database = admin.database();
    var refAdmin = database
        .ref("admin/")
        .orderByChild("Level")
        .equalTo(1);

    if (data.Stok <= 30) {
        refAdmin.once("value").then(snapshot => {
            console.log("Mengirim Notifikasi");
            snapshot.forEach(childSnapshot => {
                /* console.log("Sending..");
                console.log("Token : " + childSnapshot.val().Token); */
                pemberitahuanStok(childSnapshot.val().Token, data.Jenis, data.Stok);
            });

        });
    }

    function pemberitahuanStok(token, gas, stok) {
       
        var playload = {
            notification: {
                title: "Peringatan Stok Gas " + gas + " Menipis",
              	body: "Sisa stok gas " + gas + " berjumlah " + stok + " buah",
                sound: "default",
                tag: "1"
            }
        };
        var options = {
            priority: "high",
            contenAvailable: true
        };

        return admin.messaging().sendToDevice(token, playload, options);
    }
});


//https://us-central1-pertamina-f563b.cloudfunctions.net/stok?id=1&stok=20
