import OpenAI from 'openai';
import Conversation from '../models/Conversation.js';
import {
  createMemoryConversation,
  findMemoryConversation,
  getMemoryConversations,
  isMemoryMode,
  saveMemoryConversation,
} from '../services/memoryStore.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const createTitle = (message) => {
  const compact = message.trim().replace(/\s+/g, ' ');
  return compact.length > 48 ? `${compact.slice(0, 45)}...` : compact || 'New conversation';
};

export const getConversations = async (req, res, next) => {
  try {
    if (isMemoryMode()) {
      return res.json({
        conversations: getMemoryConversations(req.user._id),
      });
    }

    const conversations = await Conversation.find({ userId: req.user._id })
      .sort({ updatedAt: -1 })
      .select('title messages createdAt updatedAt');

    res.json({
      conversations,
    });
  } catch (error) {
    next(error);
  }
};

export const sendMessage = async (req, res, next) => {
  try {
    const { message, conversationId } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({ message: 'Message is required' });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ message: 'OPENAI_API_KEY is missing in server/.env' });
    }

    let conversation = conversationId
      ? isMemoryMode()
        ? findMemoryConversation(conversationId, req.user._id)
        : await Conversation.findOne({ _id: conversationId, userId: req.user._id })
      : null;

    if (!conversation) {
      conversation = isMemoryMode()
        ? createMemoryConversation({ userId: req.user._id, title: createTitle(message) })
        : await Conversation.create({
            userId: req.user._id,
            title: createTitle(message),
            messages: [],
          });
    }

    const history = conversation.messages.slice(-10).map((item) => ({
      role: item.role,
      content: item.content,
    }));

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are an AI career assistant. Help with interviews, resumes, career planning, coding explanations, and job preparation. Be practical, encouraging, and concise.',
        },
        ...history,
        { role: 'user', content: message.trim() },
      ],
      temperature: 0.7,
    });

    const reply = completion.choices[0]?.message?.content?.trim() || 'I could not generate a response.';

    conversation.messages.push(
      { role: 'user', content: message.trim() },
      { role: 'assistant', content: reply },
    );
    if (isMemoryMode()) {
      saveMemoryConversation(conversation);
    } else {
      await conversation.save();
    }

    res.json({
      conversationId: conversation._id,
      reply,
      conversation,
    });
  } catch (error) {
    next(error);
  }
};
