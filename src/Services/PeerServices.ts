import { PeerLog, IPeers } from '../Model/PeerModel'; 

class PeerService {

    // Create a new peer
    async createPeer(peerData: Partial<IPeers>): Promise<IPeers> {
        const peer = new PeerLog(peerData);
        return await peer.save();
    }

    // Retrieve a peer by ID
    async getPeerById(id: string): Promise<IPeers | null> {
        return await PeerLog.findById(id).exec();
    }

    // Retrieve all PeerLog
    async getAllPeers(): Promise<IPeers[]> {
        return await PeerLog.find({}).exec();
    }

    // Update a peer by ID
    async updatePeer(id: string, updateData: Partial<IPeers>): Promise<IPeers | null> {
        // Update the peer and return the updated document
        return await PeerLog.findByIdAndUpdate(id, updateData, { new: true }).exec();
    }

    // Delete a peer by ID
    async deletePeer(id: string): Promise<IPeers | null> {
        return await PeerLog.findByIdAndDelete(id).exec();
    }

    // Get paginated PeerLog
    async getPaginatedPeers(startIndex: number, limit: number): Promise<IPeers[]> {
        return await PeerLog.find({})
            .skip(startIndex)
            .limit(limit)
            .exec();
    }

    // Get paginated and sorted PeerLog
    async getPaginatedAndSortedPeers(
        startIndex: number,
        limit: number,
        sortField: keyof IPeers = 'peerName',
        sortOrder: 'asc' | 'desc' = 'asc'
    ): Promise<IPeers[]> {
        const sortDirection = sortOrder === 'asc' ? 1 : -1;
        return await PeerLog.find({}) 
            .sort({ [sortField]: sortDirection })
            .skip(startIndex)
            .limit(limit)
            .exec();
    }

    // Get PeerLog by event ID
    async getPeersByEventId(eventId: string): Promise<IPeers[]> {
        return await PeerLog.find({ eventId }).exec();
    }

    // Get the total number of PeerLog
    async getTotalPeers(): Promise<number> {
        return await PeerLog.countDocuments().exec();
    }

    // Authenticate peer based on email
    async authenticatePeer(peerEmail: string): Promise<IPeers | null> {
        return await PeerLog.findOne({ userEmail: peerEmail }).exec();
    }

    // Get peer by peerId
    async getPeerByPeerId(peerId: string): Promise<IPeers | null> {
        return await PeerLog.findOne({ peerId }).exec();
    }

    // Update peer's status (e.g., isHost, isKickedout)
    async updatePeerStatus(id: string, statusData: Partial<IPeers>): Promise<IPeers | null> {
        return await PeerLog.findByIdAndUpdate(id, statusData, { new: true }).exec();
    }


    // Get PeerLog by event ID
    async getPeersById(peerId: string): Promise<IPeers[]> {
        return await PeerLog.find({ peerId }).exec();
    }

    async getPeersByEventAndDateRange(eventId: number, startDate: Date, endDate: Date): Promise<IPeers[]> {
        try {
            return await PeerLog.find({
                eventId,
                eventJoinDatetime: { $gte: startDate, $lte: endDate },
                eventLeftDatetime: { $gte: startDate, $lte: endDate }
            }).exec();
        } catch (error) {
            console.error("Error fetching peers:", error);
            throw new Error("Failed to retrieve peers");
        }
    }


    async searchPeerLogs(
        searchField: string,
        searchText: string,
      ): Promise<any[]> {
    
        //console.log(searchField, searchText, includePeer)
    
        const queryFilter = {
          [searchField]: { $regex: searchText, $options: 'i' },  
        };
    
        const peerLogs = await PeerLog.find(queryFilter).lean();
    
        return peerLogs;
    }

    async updatePeersLeftDatetime(eventId: number, eventLeftDatetime: Date): Promise<number> {
        const result = await PeerLog.updateMany(
            { eventId: String(eventId), eventLeftDatetime: null }, 
            { $set: { eventLeftDatetime: eventLeftDatetime } } 
        );
        return result.modifiedCount; 
    }
    
    
}

export default PeerService;
