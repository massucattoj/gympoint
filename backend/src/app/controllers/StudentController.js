import * as Yup from 'yup';
import Student from '../models/Student';

class StudentController {
  // cadastro de usuario
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' });
    }

    // verificar se ja existe email cadastrado
    const studentExists = await Student.findOne({
      where: { email: req.body.email }
    });
    if (studentExists) {
      return res.status(400).json({ error: 'User already exists.' });
    }

    // se usuario nao existir...retorno para o front
    const { id, name, email, idade, peso, altura } = await Student.create(
      req.body
    );
    // const student = await Student.create(req.body);

    return res.json({
      id,
      name,
      email,
      idade,
      peso,
      altura
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' });
    }

    const { id } = req.params;
    const { email } = req.body;
    // encontrar usuario que sera editado
    const student = await Student.findByPk(id);
    if (!student) {
      return res.status(400).json({ error: 'Student does not exist.' });
    }

    // verificar se o email ja nao existe
    // porem primeiro verificar se o usuario esta mudando de fato o email
    if (email !== student.email) {
      const studentExists = await Student.findOne({ where: { email } });

      if (studentExists) {
        return res.status(400).json({ error: 'Email already exists.' });
      }
    }

    const { name, idade, peso, altura } = await student.update(req.body);
    return res.json({
      id,
      name,
      email,
      idade,
      peso,
      altura
    });
  }
}

export default new StudentController();
