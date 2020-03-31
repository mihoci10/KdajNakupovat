import axios from 'axios';
const uuid = require('device-uuid');
const hash = require('object-hash');

const url = 'http://89.142.199.135:5000/api/visits/';

class VisitService{

    static async getVisits(vTime = 0){
        if(vTime == 0){

            try{
                const res = await axios.get(url);
                const data = res.data;
                return(
                    data.map(visit => ({
                        ...visit,
                        createdAt: new Date(visit.createdAt),
                        visitStart: new Date(visit.visitStart),
                        visitEnd: new Date(visit.visitEnd),
                    }))
                );
            }catch(err){
                return(err);
            }
        }else{
            
        try{
            const res = await axios.post(url, {vTime});
            const data = res.data;
            return(
                data.map(visit => ({
                    ...visit,
                    createdAt: new Date(visit.createdAt),
                    visitStart: new Date(visit.visitStart),
                    visitEnd: new Date(visit.visitEnd),
                }))
            );
        }catch(err){
            return(err);
        }
        }
    }

    static async createVisit(vLoc, vStart, vEnd, visits){
        let vAuthor = hash(new uuid.DeviceUUID().get());
        var match = visits.filter((v) => {return (v.visitAuthor == vAuthor && (v.visitLocation[0] == vLoc[0] && v.visitLocation[1] == vLoc[1]) && v.visitStart.getTime() == vStart.getTime());});
        if(match.length != 0)
            return false;
        else
            return axios.post(`${url}/add`, {
                vAuthor,vLoc,vStart,vEnd
            });
    }

    static deleteVisit(id){
        return axios.delete(`${url}${id}`);
    }
}

export default VisitService;