import { Response } from 'express';
import {
  ContainerTypes,
  ValidatedRequest,
  ValidatedRequestSchema,
} from 'express-joi-validation';
import Joi from 'joi';
import * as nodemailer from 'nodemailer';

import logger from './logger';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'chacestew@gmail.com',
    pass: 'JayGoogGem123',
  },
});

export const schema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required().email(),
  message: Joi.string().required(),
});

interface ContactRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    name: string;
    email: string;
    message: string;
  };
}

export default function (req: ValidatedRequest<ContactRequestSchema>, res: Response) {
  transporter
    .sendMail({
      to: 'chacestew@gmail.com',
      subject: `New U3T Contact Submission`,
      text: `Name: ${req.body.name}\nEmail: ${req.body.email}\nMessage ${req.body.message}`,
    })
    .then(() => {
      res.sendStatus(200);
      logger.info('Contact submission sent');
    })
    .catch((e) => {
      console.error('In error block for contact');
      console.error(e.message);
      logger.error(`Contact submission failed: ${e.message}`);
      res.sendStatus(500);
    });
}
