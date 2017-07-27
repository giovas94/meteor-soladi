import {moment} from 'meteor/momentjs:moment';

export const formatDate = (date) => moment(date).format('DD/MM/YYYY @hh:mm:ss a');
