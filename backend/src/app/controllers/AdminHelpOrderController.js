import * as Yup from 'yup';

import HelpOrder from '../schemas/HelpOrder';
import Student from '../models/Student';

import AnswerMail from '../jobs/AnswerMail';
import Queue from '../../lib/Queue';

class AdminHelpOrderController {
  async index(req, res) {
    const helpOrders = await HelpOrder.find({ answer: null, answer_at: null });
    return res.json(helpOrders);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      answer: Yup.string().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Valiidation fails' });
    }

    const { answer } = req.body;
    const answer_at = new Date();

    const helpOrders = await HelpOrder.findByIdAndUpdate(
      req.params.id,
      { answer, answer_at },
      { new: true }
    );

    const student = await Student.findByPk(helpOrders.student_id);

    /**
     * Send email with answer
     */
    await Queue.add(AnswerMail.key, {
      student,
      helpOrders,
      answer,
      answer_at
    });

    return res.json(helpOrders);
  }
}

export default new AdminHelpOrderController();
