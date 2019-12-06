import * as Yup from 'yup';
import Plan from '../models/Plan';

class PlanController {
  async store(req, res) {
    /**
     * Create new Plans
     */

    // Ensure fields and type fields
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number()
        .required()
        .integer(),
      price: Yup.number().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    // Verify with title already exist
    const titleExists = await Plan.findOne({
      where: { title: req.body.title }
    });
    if (titleExists) {
      return res.status(400).json({ error: 'This plan already exists.' });
    }

    // Create plan
    const { id, title, duration, price } = await Plan.create(req.body);

    return res.json({
      id,
      title,
      duration,
      price
    });
  }

  async index(req, res) {
    /**
     * Show all active Plans
     */
    const plans = await Plan.findAll();

    return res.json(plans);
  }

  async update(req, res) {
    /**
     * Update Plans info
     */
    const { title } = req.body;
    const plan = await Plan.findByPk(req.params.id);

    // if change title
    if (title !== plan.title) {
      const titleExists = await Plan.findOne({ where: { title } });

      if (titleExists) {
        return res.status(400).json({ error: 'This plan already exists.' });
      }
    }

    const { id, duration, price } = await plan.update(req.body); // update all the fields

    return res.json({
      id,
      title,
      duration,
      price
    });
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
