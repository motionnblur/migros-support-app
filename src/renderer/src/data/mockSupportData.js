export const mockConversations = [
  {
    id: "ord-9021",
    name: "Order #9021",
    customer: "Melis Arslan",
    preview: "Package arrived damaged. Need replacement.",
    time: "09:45",
    unread: 2,
    priority: "High",
    channel: "Website"
  },
  {
    id: "ret-188",
    name: "Return Request",
    customer: "Can Erdem",
    preview: "I want to return two products from yesterday.",
    time: "09:30",
    unread: 0,
    priority: "Normal",
    channel: "Mobile App"
  },
  {
    id: "pay-551",
    name: "Payment Issue",
    customer: "Sena Aydin",
    preview: "Card charged twice on checkout.",
    time: "09:12",
    unread: 4,
    priority: "Urgent",
    channel: "Website"
  },
  {
    id: "ship-774",
    name: "Shipment Delay",
    customer: "Mert Tunc",
    preview: "Tracking has not updated for 4 days.",
    time: "08:57",
    unread: 1,
    priority: "Normal",
    channel: "Marketplace"
  }
];

export const mockMessages = {
  "ord-9021": [
    {
      id: "m1",
      type: "customer",
      author: "Melis Arslan",
      text: "Hi team, my package came with a broken corner and missing seal.",
      time: "09:38"
    },
    {
      id: "m2",
      type: "agent",
      author: "You",
      text: "Thanks for reporting this quickly. I can help with a replacement right away.",
      time: "09:40"
    },
    {
      id: "m3",
      type: "customer",
      author: "Melis Arslan",
      text: "Great, I can share photos if needed.",
      time: "09:43"
    },
    {
      id: "m4",
      type: "agent",
      author: "You",
      text: "Please upload 2 photos. I already prepared a priority replacement workflow.",
      time: "09:45"
    }
  ],
  "ret-188": [
    {
      id: "r1",
      type: "customer",
      author: "Can Erdem",
      text: "I ordered the wrong size. Can I return both items in one shipment?",
      time: "09:26"
    },
    {
      id: "r2",
      type: "agent",
      author: "You",
      text: "Yes. I sent one return label for both products.",
      time: "09:30"
    }
  ],
  "pay-551": [
    {
      id: "p1",
      type: "customer",
      author: "Sena Aydin",
      text: "My card was charged twice but only one order was created.",
      time: "09:05"
    },
    {
      id: "p2",
      type: "agent",
      author: "You",
      text: "I can see the duplicate authorization. Finance team is reversing it now.",
      time: "09:10"
    },
    {
      id: "p3",
      type: "customer",
      author: "Sena Aydin",
      text: "Thank you. When should I expect the refund?",
      time: "09:12"
    }
  ],
  "ship-774": [
    {
      id: "s1",
      type: "customer",
      author: "Mert Tunc",
      text: "Tracking has not moved since Friday. Is it lost?",
      time: "08:52"
    },
    {
      id: "s2",
      type: "agent",
      author: "You",
      text: "I escalated to carrier operations and marked this as delayed priority.",
      time: "08:57"
    }
  ]
};
