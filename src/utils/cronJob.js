const cron = require('node-cron');
const {startOfYesterday , endOfYesterday} = require('date-fns');
const connectionRequest = require('../models/connectionRequest');
const sendEmail = require('../utils/sendEmail');

cron.schedule('30 22 * * *' , async () => {
    try {
        const yesterdayStart = startOfYesterday();
        const yesterdayEnd = endOfYesterday();

        const pendingRequest = await connectionRequest.find({
            status : "interested",
            createdAt : {$gte : yesterdayStart , $lt : yesterdayEnd}
        }).popualte("fromUserID toUserID");

        const listOfEmails = [... new Set(pendingRequest.map(req => (req.toUserID.emailID)))];
        
        for(const emails of listOfEmails){
            const res = await run();
        }

} catch(err) {
    console.error(err);
}
});