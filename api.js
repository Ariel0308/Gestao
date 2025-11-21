import mongoose from 'mongoose';

mongoose.connect('mongodb+srv://arielsadetsky_db_user:5wzPwmsbNkTmMfqT@cluster0.hs96ai5.mongodb.net/?appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Conectado ao MongoDB'))
.catch(err => console.log('Erro de conexão:', err));