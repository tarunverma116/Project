// Application data
const appData = {
  "sampleTopics": [
    {
      "title": "Introduction to Machine Learning",
      "subject": "Computer Science",
      "level": "Beginner",
      "keywords": "supervised learning, unsupervised learning, algorithms, neural networks, data preprocessing"
    },
    {
      "title": "Fundamentals of Organic Chemistry",
      "subject": "Chemistry", 
      "level": "Intermediate",
      "keywords": "molecular structure, functional groups, reactions, stereochemistry, nomenclature"
    },
    {
      "title": "Ancient Roman History",
      "subject": "History",
      "level": "Beginner", 
      "keywords": "Roman Empire, Julius Caesar, Augustus, Roman law, military tactics"
    }
  ],
  "subjects": [
    "Computer Science",
    "Mathematics", 
    "Physics",
    "Chemistry",
    "Biology",
    "History",
    "Literature",
    "Economics",
    "Psychology",
    "Engineering"
  ],
  "contentTypes": [
    "Blog Post",
    "Study Guide", 
    "Tutorial",
    "Reference Material",
    "Lesson Plan"
  ],
  "aiTools": [
    {
      "name": "Google AI Studio",
      "description": "Advanced AI model for content generation"
    },
    {
      "name": "Gemini API", 
      "description": "Google's multimodal AI capabilities"
    },
    {
      "name": "Hugging Face Transformers",
      "description": "Open-source NLP models"
    },
    {
      "name": "OpenAI GPT",
      "description": "Powerful language understanding"
    }
  ]
};

// DOM elements
const elements = {
  form: null,
  generateBtn: null,
  sampleBtn: null,
  loadingSection: null,
  contentDisplaySection: null,
  generatedContent: null,
  generatedTitle: null,
  wordCount: null,
  readingTime: null,
  progressFill: null,
  loadingText: null,
  copyBtn: null,
  downloadBtn: null,
  markdownBtn: null,
  searchBtn: null,
  searchContainer: null,
  searchInput: null,
  successToast: null,
  toastMessage: null
};

// Application state
let currentContent = null;
let searchHighlights = [];

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
  initializeElements();
  populateAITools();
  populateSampleTopics();
  bindEventListeners();
});

// Initialize DOM elements
function initializeElements() {
  elements.form = document.getElementById('articleForm');
  elements.generateBtn = document.getElementById('generateBtn');
  elements.sampleBtn = document.getElementById('sampleBtn');
  elements.loadingSection = document.getElementById('loadingSection');
  elements.contentDisplaySection = document.getElementById('contentDisplaySection');
  elements.generatedContent = document.getElementById('generatedContent');
  elements.generatedTitle = document.getElementById('generatedTitle');
  elements.wordCount = document.getElementById('wordCount');
  elements.readingTime = document.getElementById('readingTime');
  elements.progressFill = document.getElementById('progressFill');
  elements.loadingText = document.getElementById('loadingText');
  elements.copyBtn = document.getElementById('copyBtn');
  elements.downloadBtn = document.getElementById('downloadBtn');
  elements.markdownBtn = document.getElementById('markdownBtn');
  elements.searchBtn = document.getElementById('searchBtn');
  elements.searchContainer = document.getElementById('searchContainer');
  elements.searchInput = document.getElementById('searchInput');
  elements.successToast = document.getElementById('successToast');
  elements.toastMessage = document.getElementById('toastMessage');
}

// Populate AI tools section
function populateAITools() {
  const aiToolsGrid = document.getElementById('aiToolsGrid');
  if (!aiToolsGrid) return;
  
  appData.aiTools.forEach(tool => {
    const toolElement = document.createElement('div');
    toolElement.className = 'ai-tool-card';
    toolElement.innerHTML = `
      <div class="ai-tool-name">${tool.name}</div>
      <p class="ai-tool-description">${tool.description}</p>
    `;
    aiToolsGrid.appendChild(toolElement);
  });
}

// Populate sample topics section
function populateSampleTopics() {
  const sampleTopicsGrid = document.getElementById('sampleTopicsGrid');
  if (!sampleTopicsGrid) return;
  
  appData.sampleTopics.forEach(topic => {
    const topicElement = document.createElement('div');
    topicElement.className = 'sample-topic-card';
    topicElement.innerHTML = `
      <div class="sample-topic-title">${topic.title}</div>
      <div class="sample-topic-meta">
        <span class="sample-topic-badge badge-subject">${topic.subject}</span>
        <span class="sample-topic-badge badge-level">${topic.level}</span>
      </div>
      <div class="sample-topic-keywords">${topic.keywords}</div>
    `;
    
    topicElement.addEventListener('click', () => {
      loadSampleTopic(topic);
    });
    
    sampleTopicsGrid.appendChild(topicElement);
  });
}

// Load sample topic into form
function loadSampleTopic(topic) {
  const topicField = document.getElementById('topic');
  const subjectField = document.getElementById('subject');
  const levelField = document.getElementById('level');
  const contentTypeField = document.getElementById('contentType');
  const lengthField = document.getElementById('length');
  
  if (topicField) topicField.value = `${topic.title}\n\nKeywords: ${topic.keywords}`;
  if (subjectField) subjectField.value = topic.subject;
  if (levelField) levelField.value = topic.level;
  if (contentTypeField) contentTypeField.value = 'Tutorial';
  if (lengthField) lengthField.value = 'Medium';
  
  showToast('Sample topic loaded successfully!');
}

// Bind event listeners
function bindEventListeners() {
  if (elements.form) {
    elements.form.addEventListener('submit', handleFormSubmit);
  }
  
  if (elements.sampleBtn) {
    elements.sampleBtn.addEventListener('click', loadRandomSample);
  }
  
  if (elements.copyBtn) {
    elements.copyBtn.addEventListener('click', copyToClipboard);
  }
  
  if (elements.downloadBtn) {
    elements.downloadBtn.addEventListener('click', downloadAsPDF);
  }
  
  if (elements.markdownBtn) {
    elements.markdownBtn.addEventListener('click', downloadAsMarkdown);
  }
  
  if (elements.searchBtn) {
    elements.searchBtn.addEventListener('click', toggleSearch);
  }
  
  if (elements.searchInput) {
    elements.searchInput.addEventListener('input', handleSearch);
  }
}

// Handle form submission
function handleFormSubmit(e) {
  e.preventDefault();
  
  const formData = {
    topic: getFieldValue('topic'),
    subject: getFieldValue('subject'),
    level: getFieldValue('level'),
    contentType: getFieldValue('contentType'),
    length: getFieldValue('length')
  };
  
  // Validate form
  if (!validateForm(formData)) {
    return;
  }
  
  // Start generation process
  generateArticle(formData);
}

// Get field value safely
function getFieldValue(id) {
  const field = document.getElementById(id);
  return field ? field.value.trim() : '';
}

// Validate form data
function validateForm(formData) {
  if (!formData.topic) {
    showToast('Please enter a topic or syllabus outline', 'error');
    return false;
  }
  
  if (!formData.subject || !formData.level || !formData.contentType || !formData.length) {
    showToast('Please fill in all required fields', 'error');
    return false;
  }
  
  return true;
}

// Load random sample
function loadRandomSample() {
  const randomTopic = appData.sampleTopics[Math.floor(Math.random() * appData.sampleTopics.length)];
  loadSampleTopic(randomTopic);
}

// Generate article with animation
async function generateArticle(formData) {
  // Hide content display and show loading
  if (elements.contentDisplaySection) {
    elements.contentDisplaySection.classList.add('hidden');
  }
  
  if (elements.loadingSection) {
    elements.loadingSection.classList.remove('hidden');
  }
  
  // Animation sequence
  const loadingSteps = [
    { text: 'Analyzing your topic and requirements...', progress: 20 },
    { text: 'Selecting appropriate AI models...', progress: 40 },
    { text: 'Generating content structure...', progress: 60 },
    { text: 'Writing detailed sections...', progress: 80 },
    { text: 'Finalizing and formatting...', progress: 100 }
  ];
  
  for (let i = 0; i < loadingSteps.length; i++) {
    const step = loadingSteps[i];
    
    if (elements.loadingText) {
      elements.loadingText.textContent = step.text;
    }
    
    if (elements.progressFill) {
      elements.progressFill.style.width = `${step.progress}%`;
    }
    
    await new Promise(resolve => setTimeout(resolve, 800));
  }
  
  // Generate content based on form data
  const generatedContent = generateContentFromData(formData);
  displayGeneratedContent(generatedContent);
  
  // Hide loading and show content
  if (elements.loadingSection) {
    elements.loadingSection.classList.add('hidden');
  }
  
  if (elements.contentDisplaySection) {
    elements.contentDisplaySection.classList.remove('hidden');
    elements.contentDisplaySection.classList.add('fade-in');
  }
  
  showToast('Article generated successfully!');
}

// Generate content based on form data
function generateContentFromData(formData) {
  let content = {
    title: `${formData.topic.split('\n')[0]}: A ${formData.level} ${formData.contentType}`,
    sections: []
  };
  
  // Generate content structure based on form data
  if (formData.subject === 'Computer Science' && formData.topic.toLowerCase().includes('machine learning')) {
    content = {
      title: "Introduction to Machine Learning: A Beginner's Guide",
      sections: [
        {
          heading: "What is Machine Learning?",
          content: "Machine Learning (ML) is a subset of artificial intelligence that enables computers to learn and make decisions from data without being explicitly programmed for every task. Unlike traditional programming where we write explicit instructions, ML algorithms build mathematical models based on training data to make predictions or decisions without being explicitly programmed to perform the task.\n\nAt its core, machine learning is about finding patterns in data and using those patterns to make informed predictions about new, unseen data. This approach has revolutionized numerous fields, from healthcare and finance to entertainment and transportation."
        },
        {
          heading: "Types of Machine Learning", 
          content: "There are three main types of machine learning approaches:\n\n**Supervised Learning**: This involves learning from labeled examples where both input and correct output are provided. Common applications include email spam detection, image recognition, and medical diagnosis. Popular algorithms include Linear Regression, Decision Trees, and Support Vector Machines.\n\n**Unsupervised Learning**: Here, the algorithm finds patterns in unlabeled data without being told what to look for. Examples include customer segmentation, anomaly detection, and data compression. Key techniques include K-Means clustering and Principal Component Analysis.\n\n**Reinforcement Learning**: This approach learns through trial and error by interacting with an environment and receiving rewards or penalties. It's widely used in game playing (like AlphaGo), robotics, and autonomous vehicles."
        },
        {
          heading: "Common Algorithms and Applications",
          content: "Several algorithms form the foundation of modern machine learning:\n\n**Linear Regression**: Used for predicting continuous values like house prices or stock prices. It finds the best line that fits through data points.\n\n**Decision Trees**: These create a tree-like model of decisions, making them highly interpretable. They're excellent for classification tasks and can handle both numerical and categorical data.\n\n**Neural Networks**: Inspired by the human brain, these networks can learn complex patterns and are the foundation of deep learning. They excel at image recognition, natural language processing, and complex pattern recognition.\n\n**K-Means Clustering**: An unsupervised algorithm that groups similar data points together, useful for market segmentation and data analysis."
        },
        {
          heading: "Getting Started with Machine Learning",
          content: "For beginners interested in machine learning:\n\n1. **Learn the Basics**: Start with statistics, linear algebra, and programming (Python or R)\n2. **Choose Learning Resources**: Online courses, textbooks, and practical tutorials\n3. **Practice with Real Data**: Use datasets from Kaggle, UCI ML Repository, or create your own\n4. **Use Tools and Libraries**: Scikit-learn for beginners, TensorFlow or PyTorch for deep learning\n5. **Build Projects**: Start with simple projects and gradually increase complexity\n\nRemember, machine learning is both an art and a science. Success comes from understanding the theory, practicing with real data, and continuously learning from the rapidly evolving field."
        }
      ],
      references: [
        "Introduction to Statistical Learning - James, Witten, Hastie, Tibshirani",
        "Machine Learning Yearning - Andrew Ng", 
        "Scikit-learn Documentation",
        "Coursera Machine Learning Course - Andrew Ng",
        "Kaggle Learn - Machine Learning Courses"
      ]
    };
  } else {
    // Generate generic content structure
    const topicName = formData.topic.split('\n')[0] || formData.topic;
    
    content.sections = [
      {
        heading: 'Introduction',
        content: `Welcome to this comprehensive ${formData.contentType.toLowerCase()} on ${topicName}. This ${formData.level.toLowerCase()}-level guide is designed to provide you with a thorough understanding of the key concepts and practical applications in ${formData.subject.toLowerCase()}.\n\nWhether you're a student, professional, or simply curious about this topic, this ${formData.contentType.toLowerCase()} will equip you with the knowledge and insights needed to understand and apply these concepts effectively.`
      },
      {
        heading: 'Key Concepts and Fundamentals',
        content: `Understanding the fundamental concepts is crucial for mastering any subject in ${formData.subject}. In this section, we'll explore the core principles that form the foundation of ${topicName}.\n\nThese concepts are essential building blocks that will help you develop a deeper understanding of more advanced topics. We'll break down complex ideas into manageable parts and provide practical examples to illustrate each concept.`
      },
      {
        heading: 'Detailed Analysis and Applications',
        content: `Now that we've covered the fundamentals, let's dive deeper into the practical applications and real-world implementations. This section provides comprehensive coverage of how these concepts are applied in professional settings.\n\nWe'll examine case studies, best practices, and common challenges you might encounter when working with these concepts in ${formData.subject}. Understanding both the theory and practice is essential for developing expertise in this field.`
      },
      {
        heading: 'Examples and Case Studies',
        content: `Learning through examples is one of the most effective ways to understand complex concepts. In this section, we'll explore real-world scenarios and case studies that demonstrate the practical application of the principles we've discussed.\n\nThese examples are carefully selected to represent common situations you might encounter in your studies or professional work in ${formData.subject}. Each case study includes detailed analysis and key takeaways.`
      },
      {
        heading: 'Conclusion and Next Steps',
        content: `In this ${formData.contentType.toLowerCase()}, we've covered the essential aspects of ${topicName}, from fundamental concepts to practical applications. The key to mastering this topic is consistent practice and continued learning.\n\nAs you continue your journey in ${formData.subject}, remember that understanding comes through both theoretical study and hands-on experience. Consider exploring advanced topics, participating in projects, and staying updated with the latest developments in the field.`
      }
    ];
    
    content.references = [
      `${formData.subject} Textbook - Comprehensive Guide`,
      'Academic Journals and Publications',
      'Online Learning Resources and Courses',
      'Professional Documentation and Standards',
      'Industry Case Studies and Best Practices'
    ];
  }
  
  return content;
}

// Display generated content
function displayGeneratedContent(content) {
  currentContent = content;
  
  if (elements.generatedTitle) {
    elements.generatedTitle.textContent = content.title;
  }
  
  let html = `<h1>${content.title}</h1>`;
  
  content.sections.forEach(section => {
    html += `<h2>${section.heading}</h2>`;
    html += `<div class="section-content">${formatContent(section.content)}</div>`;
  });
  
  if (content.references && content.references.length > 0) {
    html += '<h2>References and Further Reading</h2>';
    html += '<ul>';
    content.references.forEach(ref => {
      html += `<li>${ref}</li>`;
    });
    html += '</ul>';
  }
  
  if (elements.generatedContent) {
    elements.generatedContent.innerHTML = html;
  }
  
  // Update meta information
  updateContentMeta();
}

// Format content with proper paragraphs
function formatContent(content) {
  return content.split('\n\n').map(paragraph => {
    paragraph = paragraph.trim();
    if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
      return `<p><strong>${paragraph.slice(2, -2)}</strong></p>`;
    }
    if (paragraph.match(/^\d+\.\s/)) {
      return `<p>${paragraph}</p>`;
    }
    return `<p>${paragraph}</p>`;
  }).join('');
}

// Update content meta information
function updateContentMeta() {
  if (!elements.generatedContent) return;
  
  const text = elements.generatedContent.textContent;
  const wordCount = text.trim().split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200); // Average reading speed: 200 words per minute
  
  if (elements.wordCount) {
    elements.wordCount.textContent = `${wordCount} words`;
  }
  
  if (elements.readingTime) {
    elements.readingTime.textContent = `${readingTime} min read`;
  }
}

// Copy content to clipboard
async function copyToClipboard() {
  try {
    if (!elements.generatedContent) {
      showToast('No content to copy', 'error');
      return;
    }
    
    const text = elements.generatedContent.textContent;
    await navigator.clipboard.writeText(text);
    showToast('Content copied to clipboard!');
  } catch (err) {
    showToast('Failed to copy content', 'error');
  }
}

// Download as PDF (simplified version)
function downloadAsPDF() {
  if (!currentContent) {
    showToast('No content to download', 'error');
    return;
  }
  
  const content = elements.generatedContent.innerHTML;
  const printWindow = window.open('', '_blank');
  
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>${currentContent.title}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 20px; }
        h1 { color: #2c5282; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; }
        h2 { color: #3182ce; margin-top: 30px; }
        p { margin-bottom: 15px; text-align: justify; }
      </style>
    </head>
    <body>
      ${content}
    </body>
    </html>
  `);
  
  printWindow.document.close();
  printWindow.focus();
  
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
    showToast('PDF download initiated!');
  }, 250);
}

// Download as Markdown
function downloadAsMarkdown() {
  if (!currentContent) {
    showToast('No content to download', 'error');
    return;
  }
  
  let markdown = `# ${currentContent.title}\n\n`;
  
  currentContent.sections.forEach(section => {
    markdown += `## ${section.heading}\n\n`;
    markdown += `${section.content.replace(/<[^>]*>/g, '').replace(/\*\*(.*?)\*\*/g, '**$1**')}\n\n`;
  });
  
  if (currentContent.references) {
    markdown += '## References\n\n';
    currentContent.references.forEach(ref => {
      markdown += `- ${ref}\n`;
    });
  }
  
  const blob = new Blob([markdown], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `${currentContent.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  showToast('Markdown file downloaded!');
}

// Toggle search functionality
function toggleSearch() {
  if (!elements.searchContainer) return;
  
  elements.searchContainer.classList.toggle('hidden');
  if (!elements.searchContainer.classList.contains('hidden')) {
    if (elements.searchInput) {
      elements.searchInput.focus();
    }
  } else {
    clearSearchHighlights();
    if (elements.searchInput) {
      elements.searchInput.value = '';
    }
  }
}

// Handle search input
function handleSearch(e) {
  const searchTerm = e.target.value.trim().toLowerCase();
  clearSearchHighlights();
  
  if (searchTerm.length < 2) {
    return;
  }
  
  highlightSearchTerms(searchTerm);
}

// Clear search highlights
function clearSearchHighlights() {
  searchHighlights.forEach(highlight => {
    const parent = highlight.parentNode;
    if (parent) {
      parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
      parent.normalize();
    }
  });
  searchHighlights = [];
}

// Highlight search terms
function highlightSearchTerms(searchTerm) {
  if (!elements.generatedContent) return;
  
  const walker = document.createTreeWalker(
    elements.generatedContent,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );
  
  const textNodes = [];
  let node;
  
  while (node = walker.nextNode()) {
    textNodes.push(node);
  }
  
  textNodes.forEach(textNode => {
    const text = textNode.textContent;
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    
    if (regex.test(text)) {
      const highlightedHTML = text.replace(regex, '<span class="search-highlight">$1</span>');
      const wrapper = document.createElement('div');
      wrapper.innerHTML = highlightedHTML;
      
      const parent = textNode.parentNode;
      while (wrapper.firstChild) {
        const child = wrapper.firstChild;
        if (child.nodeType === Node.ELEMENT_NODE && child.classList.contains('search-highlight')) {
          searchHighlights.push(child);
        }
        parent.insertBefore(child, textNode);
      }
      parent.removeChild(textNode);
    }
  });
}

// Show toast notification
function showToast(message, type = 'success') {
  if (!elements.toastMessage || !elements.successToast) return;
  
  elements.toastMessage.textContent = message;
  elements.successToast.className = `toast ${type}`;
  elements.successToast.classList.remove('hidden');
  
  setTimeout(() => {
    elements.successToast.classList.add('hidden');
  }, 3000);
}