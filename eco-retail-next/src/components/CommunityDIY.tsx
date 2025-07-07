import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Avatar,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Park as EcoIcon,
  Recycling as RecyclingIcon,
  LocalFlorist as PlantIcon,
  Home as HomeIcon,
  ThumbUp as ThumbUpIcon,
  Upload as UploadIcon
} from '@mui/icons-material';

interface DIYProject {
  id: string;
  title: string;
  description: string;
  materials: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  image?: string;
  author: string;
  likes: number;
  createdAt: Date;
}

const sampleProjects: DIYProject[] = [
  {
    id: '1',
    title: 'Cardboard Plant Pots',
    description: 'Transform old cardboard boxes into beautiful plant pots. Perfect for starting seeds or small plants.',
    materials: ['Cardboard boxes', 'Scissors', 'Non-toxic paint', 'Clear sealant'],
    difficulty: 'Easy',
    category: 'Gardening',
    author: 'EcoWarrior',
    likes: 24,
    createdAt: new Date('2024-01-15T10:00:00Z')
  },
  {
    id: '2',
    title: 'Plastic Bottle Bird Feeder',
    description: 'Create a sustainable bird feeder from recycled plastic bottles. Attract local wildlife to your garden.',
    materials: ['Plastic bottle', 'Wooden spoons', 'String', 'Bird seed'],
    difficulty: 'Easy',
    category: 'Wildlife',
    author: 'NatureLover',
    likes: 18,
    createdAt: new Date('2024-01-10T14:30:00Z')
  },
  {
    id: '3',
    title: 'Glass Jar Candle Holders',
    description: 'Turn old glass jars into elegant candle holders. Perfect for creating ambient lighting.',
    materials: ['Glass jars', 'Tea lights', 'Decorative elements', 'Paint (optional)'],
    difficulty: 'Easy',
    category: 'Home Decor',
    author: 'CraftMaster',
    likes: 31,
    createdAt: new Date('2024-01-08T16:45:00Z')
  },
  {
    id: '4',
    title: 'Newspaper Storage Baskets',
    description: 'Weave beautiful storage baskets from old newspapers. Strong and eco-friendly storage solution.',
    materials: ['Newspapers', 'Glue', 'Paint', 'Varnish'],
    difficulty: 'Medium',
    category: 'Storage',
    author: 'WeaverPro',
    likes: 15,
    createdAt: new Date('2024-01-05T09:15:00Z')
  }
];

const categories = [
  { name: 'Gardening', icon: <PlantIcon />, color: 'success' },
  { name: 'Wildlife', icon: <EcoIcon />, color: 'primary' },
  { name: 'Home Decor', icon: <HomeIcon />, color: 'secondary' },
  { name: 'Storage', icon: <RecyclingIcon />, color: 'warning' }
];

export default function CommunityDIY() {
  const [projects, setProjects] = useState<DIYProject[]>(sampleProjects);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    materials: '',
    difficulty: 'Easy' as const,
    category: 'Gardening'
  });

  const handleAddProject = () => {
    const project: DIYProject = {
      id: Date.now().toString(),
      title: newProject.title,
      description: newProject.description,
      materials: newProject.materials.split(',').map(m => m.trim()),
      difficulty: newProject.difficulty,
      category: newProject.category,
      author: 'You',
      likes: 0,
      createdAt: new Date() // This is fine as it's only called on user interaction
    };

    setProjects([project, ...projects]);
    setOpenDialog(false);
    setNewProject({
      title: '',
      description: '',
      materials: '',
      difficulty: 'Easy',
      category: 'Gardening'
    });
  };

  const handleLike = (projectId: string) => {
    setProjects(prev => 
      prev.map(project => 
        project.id === projectId 
          ? { ...project, likes: project.likes + 1 }
          : project
      )
    );
  };

  const filteredProjects = selectedCategory === 'All' 
    ? projects 
    : projects.filter(project => project.category === selectedCategory);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'success';
      case 'Medium': return 'warning';
      case 'Hard': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ color: 'success.main', fontWeight: 'bold', mb: 2 }}>
          Community DIY Projects
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
          Share and discover creative ways to repurpose waste materials
        </Typography>
        
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
          sx={{ 
            bgcolor: 'success.main',
            '&:hover': { bgcolor: 'success.dark' }
          }}
        >
          Share Your Project
        </Button>
      </Box>

      {/* Category Filter */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2, color: 'success.main' }}>
          Filter by Category
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          <Chip
            label="All"
            variant={selectedCategory === 'All' ? "filled" : "outlined"}
            color={selectedCategory === 'All' ? "success" : "default"}
            onClick={() => setSelectedCategory('All')}
          />
          {categories.map((category) => (
            <Chip
              key={category.name}
              icon={category.icon}
              label={category.name}
              variant={selectedCategory === category.name ? "filled" : "outlined"}
              color={selectedCategory === category.name ? "success" : "default"}
              onClick={() => setSelectedCategory(category.name)}
            />
          ))}
        </Box>
      </Box>

      {/* Projects Grid */}
      <Grid container spacing={3}>
        {filteredProjects.map((project) => (
          <Grid xs={12} sm={6} md={4} key={project.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="200"
                image={project.image || `https://source.unsplash.com/400x200/?${project.category.toLowerCase()}`}
                alt={project.title}
              />
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" component="h3" sx={{ mb: 1 }}>
                  {project.title}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                  {project.description}
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    Materials:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                    {project.materials.slice(0, 3).map((material, index) => (
                      <Chip
                        key={index}
                        label={material}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '0.7rem' }}
                      />
                    ))}
                    {project.materials.length > 3 && (
                      <Chip
                        label={`+${project.materials.length - 3} more`}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '0.7rem' }}
                      />
                    )}
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Chip
                    label={project.difficulty}
                    size="small"
                    color={getDifficultyColor(project.difficulty) as any}
                  />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Tooltip title="Like this project">
                      <IconButton
                        size="small"
                        onClick={() => handleLike(project.id)}
                        sx={{ color: 'success.main' }}
                      >
                        <ThumbUpIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Typography variant="caption" color="text.secondary">
                      {project.likes}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                  <Avatar sx={{ width: 24, height: 24, fontSize: '0.8rem' }}>
                    {project.author.charAt(0)}
                  </Avatar>
                  <Typography variant="caption" color="text.secondary">
                    by {project.author}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Add Project Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Share Your DIY Project</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Project Title"
            value={newProject.title}
            onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            fullWidth
            label="Description"
            multiline
            rows={3}
            value={newProject.description}
            onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Materials (comma-separated)"
            value={newProject.materials}
            onChange={(e) => setNewProject({ ...newProject, materials: e.target.value })}
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              select
              label="Difficulty"
              value={newProject.difficulty}
              onChange={(e) => setNewProject({ ...newProject, difficulty: e.target.value as any })}
              sx={{ flex: 1 }}
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </TextField>
            <TextField
              select
              label="Category"
              value={newProject.category}
              onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
              sx={{ flex: 1 }}
            >
              {categories.map((category) => (
                <option key={category.name} value={category.name}>
                  {category.name}
                </option>
              ))}
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleAddProject}
            variant="contained"
            disabled={!newProject.title || !newProject.description}
            sx={{ bgcolor: 'success.main' }}
          >
            Share Project
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 