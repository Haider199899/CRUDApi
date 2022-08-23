import logger from 'pino';
import dayjs from 'dayjs';
import exp from 'constants';
const log=logger({
   
    base:{
        pid:false,
    },
    timestamp:()=>`"time":${dayjs().format}`,

});
export default {log};