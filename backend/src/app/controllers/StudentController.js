import Student from '../models/Student';

class StudentController {
  // cadastro de usuario
  async store(req, res) {
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
    const { name, email, idade, peso, altura } = req.body;

    // encontrar usuario que sera editado
    const student = await Student.findByPk(req.params);

    // verificar se o email ja nao existe
    // porem primeiro verificar se o usuario esta mudando de fato o email
    if (email !== student.email) {
      const studentExists = await Student.findOne({ where: { email } });

      if (studentExists) {
        return res.status(400).json({ error: 'Email already exists.' });
      }
    }

    await student.update(req.body);
    return res.json(student);
  }
}

export default new StudentController();
