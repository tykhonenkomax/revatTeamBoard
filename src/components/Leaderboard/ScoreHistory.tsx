import React from "react";
import styled from "styled-components";
import { Athlete } from "../../types";

export const ScoreHistory: React.FC<{ selectedAthlete?: Athlete }> = ({
                                                                          selectedAthlete,
                                                                      }) => {
    return (
        <Wrapper>
            <Title>Історія балів</Title>

            {!selectedAthlete || selectedAthlete.scoreHistory.length === 0 ? (
                <EmptyText>Поки немає історії. Додай перші бали ✨</EmptyText>
            ) : (
                <List>
                    {[...selectedAthlete.scoreHistory]
                        .reverse()
                        .slice(0, 6)
                        .map((s) => (
                            <ListItem key={s.id}>
                                <Points>+{s.points}</Points>
                                {s.reason}
                            </ListItem>
                        ))}
                </List>
            )}
        </Wrapper>
    );
};

/* ===================== STYLES ===================== */

const Wrapper = styled.div`
    background: #0d0d0d;
    border-radius: 18px;
    padding: 16px;
    border: 1px solid #262626;
    max-width: 260px; /* 🔹 звужено */
    margin-left: auto;
    margin-right: auto;
`;

const Title = styled.h3`
    margin: 0 0 8px 0;
    font-size: 15px;
    color: #fff;
`;

const EmptyText = styled.div`
    color: #888;
    font-size: 13px;
    text-align: center;
`;

const List = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
`;

const ListItem = styled.li`
    padding: 6px 0;
    border-bottom: 1px solid #222;
    color: #ccc;
    font-size: 13px;
    display: flex;
    align-items: center;
`;

const Points = styled.span`
    color: #ff4b3a;
    margin-right: 6px;
    font-weight: 600;
`;
