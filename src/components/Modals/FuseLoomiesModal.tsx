import {StyleSheet, Text, View } from "react-native";
import React, {useEffect,useState} from 'react';
import Modal from 'react-native-modal';
import { CustomButton } from "../CustomButton";
import { TCaughtLoomies, TCaughtLoomiesWithTeam } from "@src/types/types";
import {
    getLoomieTeamService,
    getLoomiesRequest
} from '@src/services/user.services';
import { LoomiesGrid } from '@src/components/CaughtLoomiesGrid/LoomiesGrid';
/*
import { TCaughtLoomies, TCaughtLoomiesWithTeam } from "@src/types/types";
import { EmptyMessage } from '@src/components/EmptyMessage';*/
import { LoomiesGridSkeleton } from '@src/skeletons/CaughtLoomiesGrid/LoomiesGridSkeleton';
import { Container } from '@src/components/Container';
import { useIsFocused } from "@react-navigation/native";


interface IProps {
    isVisible: boolean;
    serial: number;
    id: string;
    callBack(): void;
    close(): void;
}

export const FuseLoomiesModal = ({ isVisible, callBack, close,serial,id}: IProps) => {

    const fuseLoomies = () => {
        console.log("fuse")
    };

    const [loomies, setLoomies] = useState(Array<TCaughtLoomiesWithTeam>);
    const [team, setTeam] = useState(Array<string>);
    const [loading, setLoading] = useState(true);
    const focused = useIsFocused();

    const getLoomieTeam = async () => {
        const [response, error] = await getLoomieTeamService();
        if (error) return;

        const loomies = response.team;
        const ids = loomies.map((loomie: TCaughtLoomies) => loomie._id);
        console.log(ids)
        setTeam(ids);
    };

    const getLoomies = async () => {
        const [response, error] = await getLoomiesRequest();
        if (error) return;

        let loomies: TCaughtLoomies[] = response.loomies;

        loomies = loomies.filter((item) => item.is_busy == false && item._id != id && item.serial == serial);
        
        const loomiesWithTeamProperty = loomies.map((loomie) => ({
            ...loomie,
            is_in_team: team.includes(loomie._id)
        }));

        setLoomies(loomiesWithTeamProperty);
        setLoading(false);
    };

    // First, get the team, then get the loomies
    useEffect(() => {
        if (!focused) return;
        getLoomieTeam();
    }, [focused]);

    // When the team is obtained, we get the loomies
    useEffect(() => {
        getLoomies();
    }, [team]);


    const handleSave = async () => {
        console.log(id);
    };

    const redirectionHeader = (
        <View style={{ paddingHorizontal: 10 }}>
            <CustomButton title='Save' type='primary' callback={handleSave} />
        </View>
    );

    const handleLoomiePress = (loomieId: string) => {
        console.log("entro");
        console.log(loomieId);
    };

    return (
        <Modal isVisible={isVisible} onBackdropPress={callBack}>
            <View style={Styles.container}>
                <View style={Styles.modal}>
                    <Text style={Styles.modalTitle}>Fuse Loomies</Text>
                    <Text style={Styles.modalTitle}>{serial}</Text>
                    <Text style={Styles.modalTitle}>{id}</Text>
                    <Container>
                        {loading ? (
                            <LoomiesGridSkeleton />
                        ) : (
                            <LoomiesGrid
                            loomies={loomies}
                            markBusyLoomies={false}
                            markTeamLoomies={true}
                            elementsCallback={() => console.log("sdfd")}
                            listHeaderComponent={redirectionHeader}
                            />
                        )}
                    </Container>
                    <View style={Styles.containerButton}>
                        <CustomButton
                            title='Accept'
                            type='primary'
                            callback={fuseLoomies}
                        />
                    </View>
                    <View style={Styles.containerButton}>
                        <CustomButton
                            title='Cancel'
                            type='primary'
                            callback={close}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    )
}

const Styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    modal: {
        backgroundColor: '#fff',
        width: '96%',
        padding: 12
    },
    modalTitle: {
        color: '#ED4A5F',
        fontSize: 26,
        fontWeight: 'bold',
        textAlign: 'center',
        textTransform: 'uppercase'
    },
    containerButton: {
        alignSelf: 'center',
        width: '92%'
    }
});