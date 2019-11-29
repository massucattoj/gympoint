import * as Yup from 'yup';
import Plan from '../models/Plan';

class PlanController {
  async store(req, res) {
    // const { id, title, duration, price } = await Plan.create(req.body);
    const { id, title, duration, price } = await Plan.create(req.body);

    return res.json({
      id,
      title,
      duration,
      price
    });
  }

  async index(req, res) {
    const plans = await Plan.findAll();

    return res.json(plans);
  }

  async update(req, res) {
    return res.json();
  }

  async delete(req, res) {
    /**
     * Delete plan with user is admin
     */
    await Plan.destroy({
      where: { id: req.params.id }
    });

    return res.json({ message: 'Plan deleted with successful' });
  }
}

export default new PlanController();
