const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'tictalktoe',
    brokers: ['192.168.49.2:30005'],
    sasl: {
        mechanism: 'plain',
        username: 'user1',
        password: 'OEJat39I5p'
    },
});

/* Producer instance */
const producer = kafka.producer();
/* Consumer instance */
const consumer = kafka.consumer({ groupId: 'tictactoe-game-group' });
/* Admin instance for managing topics */
const admin = kafka.admin();


/* Connect the producer and consumer */
const connectKafka = async () => {
    await producer.connect();
    await consumer.connect();
}

/* Function to delete a topic */
async function deleteTopic(topicName) {
    await admin.deleteTopics({
        topics: [topicName]
    })
}

/* Function to create a new topic */
async function createTopic(topicName) {
    try {
        await admin.connect();
        await admin.createTopics({
            topics: [{
                topic: topicName,
                numPartitions: 3,
                replicationFactor: 1
            }]
        });
        console.log('Topic created successfully');
    } catch (error) {
        console.error('Error creating topic:', error);
    } finally {
        await admin.disconnect();
    }
}

/* Function to produce a message to a topic */
const produceMessage = async (topic, keyInput, valueInput) => {
    await producer.send({
        topic,
        messages: [
            { key: keyInput, value: valueInput },
        ],
    });
}


/* Function to consume messages from a topic */
const consumeMessages = async (topic) => {
    await consumer.subscribe({ topic, fromBeginning: true });
    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            try {
                console.log({
                    value: "{Topic: " + topic + "} Kafka Consumer: " + message.value.toString(),
                });
            } catch (error) {
                console.error('Error processing message:', error);
            }
        },
    });
}

/* Function to disconnect Kafka clients */
const disconnectKafka = async () => {
    console.log('Disconnecting Kafka client...');
    if (consumer) {
        console.log('Disconnecting Kafka consumer...');
        await consumer.disconnect();
    }

    if (producer) {
        console.log('Disconnecting Kafka producer...');
        await producer.disconnect();
    }
    console.log('Kafka client disconnected successfully');
}

module.exports = {
    connectKafka,
    produceMessage,
    consumeMessages,
    createTopic,
    disconnectKafka,
    deleteTopic
}
