import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const users = [];
const conversations = [];

const withoutPassword = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
});

export const isMemoryMode = () => globalThis.useMemoryStore === true;

export const createMemoryUser = async ({ name, email, password }) => {
  const existingUser = users.find((user) => user.email === email.toLowerCase());

  if (existingUser) {
    return null;
  }

  const user = {
    _id: crypto.randomUUID(),
    name,
    email: email.toLowerCase(),
    password: await bcrypt.hash(password, 10),
  };

  users.push(user);
  return withoutPassword(user);
};

export const findMemoryUserByEmail = (email) => users.find((user) => user.email === email.toLowerCase());

export const findMemoryUserById = (userId) => {
  const user = users.find((item) => item._id === userId);
  return user ? withoutPassword(user) : null;
};

export const compareMemoryPassword = (password, hash) => bcrypt.compare(password, hash);

export const getMemoryConversations = (userId) =>
  conversations
    .filter((conversation) => conversation.userId === userId)
    .sort((a, b) => b.updatedAt - a.updatedAt);

export const findMemoryConversation = (conversationId, userId) =>
  conversations.find((conversation) => conversation._id === conversationId && conversation.userId === userId);

export const createMemoryConversation = ({ userId, title }) => {
  const now = new Date();
  const conversation = {
    _id: crypto.randomUUID(),
    userId,
    title,
    messages: [],
    createdAt: now,
    updatedAt: now,
  };

  conversations.push(conversation);
  return conversation;
};

export const saveMemoryConversation = (conversation) => {
  conversation.updatedAt = new Date();
  return conversation;
};
