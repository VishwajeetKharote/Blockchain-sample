"use strict"
const express = require('express');
const router = express.Router();


const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
let bizNetworkConnection = new BusinessNetworkConnection();

router.post('/createuser', async function (req,res){

    try{
        console.log("inside function");
        let businessNetworkDefinition = await bizNetworkConnection.connect('admin@car-network');
        let registry = await bizNetworkConnection.getParticipantRegistry('org.home.rd.SampleParticipant');
        let aregistry = await bizNetworkConnection.getAssetRegistry('org.home.rd.SampleAsset');
        let factory = businessNetworkDefinition.getFactory();
        let newParticipant = factory.newResource('org.home.rd', 'SampleParticipant', req.body.pId);

        newParticipant.participantId = req.body.pId;
        newParticipant.firstName = req.body.fname;
        newParticipant.lastName = req.body.lname;

        await registry.add(newParticipant);

        let assetRelation = factory.newResource('org.home.rd', 'SampleAsset', req.body.assetId);
        let owner = factory.newRelationship('org.home.rd', 'SampleParticipant', req.body.pId);
        assetRelation.assetId = req.body.assetId;
       assetRelation.owner = factory.newRelationship('org.home.rd', 'SampleParticipant', req.body.pId);
       assetRelation.assetId = req.body.assetId;
        assetRelation.value = req.body.value;

        await aregistry.add(assetRelation);


        //let response = await registry.get(req.body.pId);
        //console.log(response);
        res.send('This works');
    }
    catch(error){
        console.log(error);
    }
})


router.post('/updateAssest', async function(req,res){

    try{
        //console.log('newValue ==>', req.body.newValue);
        let businessNetworkDefinition = await bizNetworkConnection.connect('admin@car-network');
        //let Pregistry = await bizNetworkConnection.getParticipantRegistry('org.home.rd.SampleParticipant');
        //let person = await Pregistry.get("8499");
        //console.log(person);
       let aregistry = await bizNetworkConnection.getAssetRegistry('org.home.rd.SampleAsset');
        let asset = await aregistry.getAll();
        res.send(asset);
        // console.log('assetId =>', asset.assetId);
        // let serializer = businessNetworkDefinition.getSerializer();
        // let newValue = req.body.newValue;
        // let resource = serializer.fromJSON({
        //     "$class": "org.home.rd.SampleTransaction",
        //     "asset": "resource:org.home.rd.SampleAsset#6453" ,
        //     "newValue": newValue
        //   });

        //   await bizNetworkConnection.submitTransaction(resource);
        //   await bizNetworkConnection.disconnect();

        //   console.log('Transaction submitted');

         
        //   res.send('This works');
    }catch(error){
        console.log(error);
    }
});


router.post('/commitTransaction', async function (req,res){

    try{
        let businessNetworkDefinition = await bizNetworkConnection.connect('admin@car-network');
        let serializer = businessNetworkDefinition.getSerializer();
        let resource = serializer.fromJSON({
            "$class": "org.home.rd.SampleTransaction",
            "asset": "resource:org.home.rd.SampleAsset#"+req.body.assetId,
            "newValue": req.body.newValue
          });

          await bizNetworkConnection.submitTransaction(resource);
          let historian = await bizNetworkConnection.getHistorian();
          let historianRecords = await historian.getAll();
          console.log(historianRecords);
          res.send(historianRecords);
        // {
        //     "$class": "org.home.rd.SampleTransaction",
        //     "asset": "resource:org.home.rd.SampleAsset#2103",
        //     "newValue": ""
        //   }
    }catch(error){
        console.log(error);
    }



});


module.exports = router;