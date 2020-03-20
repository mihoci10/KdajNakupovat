import axios from 'axios';

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

    static createVisit(vAuthor, vLoc, vStart, vEnd){
        return axios.post(`${url}/add`, {
            vAuthor,vLoc,vStart,vEnd
        });
    }

    static deleteVisit(id){
        return axios.delete(`${url}${id}`);
    }
}

export default VisitService;