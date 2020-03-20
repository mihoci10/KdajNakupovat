const express = require('express');
const mongodb = require('mongodb');

const router = express.Router();

router.get('/', async (req, res) => {
    const visits = await loadVisitCollection();
    res.send(await visits.find({}).toArray());
});

router.post('/', async (req, res) => {
    const visits = await loadVisitCollection();
    res.send(await (await visits.find({}).toArray()).filter(visit => {
        return (new Date(visit.visitStart)) <= (new Date(req.body.vTime)) && (new Date(visit.visitEnd)) >= (new Date(req.body.vTime));
    }));
});

router.post('/add', async (req,res) => {
    const visits = await loadVisitCollection();
    await visits.insertOne({
        visitAuthor: req.body.vAuthor,
        visitLocation: req.body.vLoc,
        visitStart: new Date(req.body.vStart).toISOString(),
        visitEnd: new Date(req.body.vEnd).toISOString(),
        createdAt: new Date().toISOString()
    });
    res.status(201).send();
});

router.delete('/:id', async (req,res) => {
    const visits = await loadVisitCollection();
    await visits.deleteOne({_id: new mongodb.ObjectID(req.params.id)});
    res.status(200).send();
});

async function loadVisitCollection(){
    const client = await mongodb.MongoClient.connect(`mongodb://kn_admin:kn_pass@192.168.1.11:27017/`, {useNewUrlParser: true});

    return client.db('kdajNakupovat').collection('visit');
}

module.exports = router;