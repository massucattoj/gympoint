import * as Yup from 'yup';
import HelpOrder from '../schemas/HelpOrder';

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

    return res.json(helpOrders);
  }
}

export default new AdminHelpOrderController();
