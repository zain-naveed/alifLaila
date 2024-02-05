import { NoFavBookIcon } from "assets";
import classNames from "classnames";
import { InferGetServerSidePropsType } from "next";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "shared/components/common/customButton";
import DashboardWraper from "shared/components/common/dashboardWrapper";
import NoContentCard from "shared/components/common/noContentCard";
import { toastMessage } from "shared/components/common/toast";
import TicketsCard from "shared/components/publisher/supportComponents/support";
import Ticket from "shared/components/publisher/supportComponents/ticket";
import AddTicketModal from "shared/modal/addTicket";
import { setBreadCrumb } from "shared/redux/reducers/breadCrumbSlice";
import {
  closeTicket,
  getMessages,
  sendMessage,
} from "shared/services/publisher/ticketService";
import { BaseURL, Endpoint } from "shared/utils/endpoints";
import { accountStatus, roles, ticketStatus } from "shared/utils/enum";
import { checkFileIsDoc, checkFileType, withError } from "shared/utils/helper";
import {
  independentAuthorPathConstants,
  partnerPendingPathConstants,
  publisherPartnerEnabledPathConstants,
  publisherPathConstants,
} from "shared/utils/sidebarConstants/partnerConstants";
import styles from "./style.module.scss";

function SupportChat({
  chats,
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const account_status = JSON.parse(user ? user : "{}")?.status;
  const isParentEnabled = JSON.parse(user ?? '{}')?.is_partner_enabled_server;

  const dispatch = useDispatch();
  const {
    login: {
      user: { role },
    },
  } = useSelector((state: any) => state.root);
  const [list, setList] = useState<any[]>(chats?.data);
  const [comment, setComment] = useState<string>("");
  const [messageList, setMessageList] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [senderLoading, setSenderLoading] = useState<boolean>(false);
  const [completeLoading, setCompleteLoading] = useState<boolean>(false);
  const [files, setFiles] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  const handleShowAddModal = () => {
    setShowAddModal(true);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
  };

  const getChatMessages = (id: number) => {
    setLoading(true);
    getMessages(id)
      .then(({ data: { status, data } }) => {
        if (status && data !== null) {
          setMessageList(data);
        }
      })
      .catch((err) => {
        toastMessage("error", err?.response?.data?.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSendMessage = async () => {
    if (files?.length > 0 || comment !== "") {
      let messageStatus = false;
      let tempArr = [...messageList];
      setSenderLoading(true);
      const formData = new FormData();
      formData.append("ticket_id", selected?.id);

      if (comment !== "") {
        formData.append("type", "1");
        formData.append("comment", comment);
        await sendMessage(formData)
          .then(({ data: { data, message, status } }) => {
            if (status) {
              tempArr.push(data);

              messageStatus = true;
              setComment("");
              handleUpdateList(selected?.id, data )
            }
          })
          .catch((err) => {
            messageStatus = false;
          })
          .finally(() => {
            setSenderLoading(false);
          });
      }
      if (files?.length > 0) {
        for (let file of files) {
          if (checkFileType(file?.type)) {
            if (formData.has("type")) {
              formData.set("type", "2");
            } else {
              formData.append("type", "2");
            }
          } else if (checkFileIsDoc(file?.type)) {
            if (formData.has("type")) {
              formData.set("type", "3");
            } else {
              formData.append("type", "3");
            }
          }
          if (formData.has("comment")) {
            formData.delete("comment");
          }
          formData.append("attachment", file);
          await sendMessage(formData)
            .then(({ data: { data, message, status } }) => {
              if (status) {
                tempArr.push(data);
                messageStatus = true;
                setFiles([]);
              }
            })
            .catch((err) => {
              messageStatus = false;
            })
            .finally(() => {
              setSenderLoading(false);
            });
        }
      }
      setMessageList(tempArr);
      if (messageStatus) {
        toastMessage("info", "Comment Added");
      } else {
        toastMessage("error", "Something went wrong. Please try again later");
      }
    }
  };

  const handleUpdateList = (id:any, data:any) => {
    let tempList = [...list];
    let index = tempList.findIndex((item:any)=> item?.id === id)
    if(index > -1){
      tempList[index].last_comment = data
    }
    setList(tempList)
  }

  const handleCompleteTicket = () => {
    setCompleteLoading(true);
    closeTicket(selected?.id)
      .then(({ data: { data, message, status } }) => {
        if (status) {
          let arr1 = [...list];
          let arr2 = [data];
          setSelected(data);
          setList(arr1.map((obj) => arr2.find((o) => o.id === obj.id) || obj));
          toastMessage("info", message);
        } else {
          toastMessage("error", message);
        }
      })
      .catch((err) => {
        toastMessage("error", err?.response?.data?.message);
      })
      .finally(() => {
        setCompleteLoading(false);
      });
  };

  const handleRemoveFile = (inx: number) => {
    let tempArr = [...files];
    if (inx > -1) {
      // only splice array when item is found
      tempArr.splice(inx, 1); // 2nd parameter means remove one item only
    }
    setFiles(tempArr);
  };

  useEffect(() => {
    if (chats?.data?.length > 0) {
      setSelected(chats?.data[0]);
      getChatMessages(chats?.data[0]?.id);
      setFiles([]);
    }
  }, []);

  useEffect(() => {
    dispatch(
      setBreadCrumb({
        crumbs: [
          {
            title: "Support Chat",
          },
        ],
      })
    );
  }, []);

  return (
    <DashboardWraper
      navigationItems={
        account_status === accountStatus.pending
          ? partnerPendingPathConstants
          : role === roles.publisher
          ? isParentEnabled
          ? publisherPartnerEnabledPathConstants
          : publisherPathConstants
          : independentAuthorPathConstants
      }
    >
      <div className={classNames(styles.supportWrapper, "d-flex  row p-0 m-0")}>
        {list?.length > 0 ? (
          <>
            <div
              className={classNames(
                styles.ticketsList,
                styles.leftContainer,
                "gap-3 col-12 col-lg-4 ps-0 pe-0"
              )}
            >
              <div className={classNames("w-100")}>
                <CustomButton
                  title="Add New"
                  containerStyle={classNames(styles.addTicket, " d-flex")}
                  onClick={handleShowAddModal}
                />
              </div>

              {list?.map((itm, inx) => {
                return (
                  <>
                    <TicketsCard
                      item={itm}
                      key={inx}
                      isMakred={itm?.status === ticketStatus.closed}
                      isActive={selected?.id === itm?.id}
                      onClick={() => {
                        setSelected(itm);
                        getChatMessages(itm?.id);
                      }}
                    />
                    {selected?.id === itm?.id ? (
                      <Ticket
                        files={files}
                        selected={selected}
                        loading={loading}
                        completeLoading={completeLoading}
                        handleCompleteTicket={handleCompleteTicket}
                        messageList={messageList}
                        handleRemoveFile={handleRemoveFile}
                        senderLoading={senderLoading}
                        comment={comment}
                        setComment={setComment}
                        handleSendMessage={handleSendMessage}
                        setFiles={setFiles}
                        containerClass="col-12 p-0 m-0 d-lg-none d-flex"
                      />
                    ) : null}
                  </>
                );
              })}
            </div>
            <Ticket
              files={files}
              selected={selected}
              loading={loading}
              completeLoading={completeLoading}
              handleCompleteTicket={handleCompleteTicket}
              messageList={messageList}
              handleRemoveFile={handleRemoveFile}
              senderLoading={senderLoading}
              comment={comment}
              setComment={setComment}
              handleSendMessage={handleSendMessage}
              setFiles={setFiles}
              containerClass="col-12 col-lg-8 d-none d-lg-flex"
            />
          </>
        ) : (
          <div
            className={classNames(
              "w-100 d-flex flex-column align-items-center justify-content-center",
              styles.notContentFoundContnr
            )}
          >
            <NoContentCard
              label1="No Tickets's Found"
              label2="This page is initially left blank. Check back later for updates."
              customContainer={classNames("gap-0")}
              Icon={NoFavBookIcon}
            />
            <CustomButton
              title="Add New"
              containerStyle={classNames(styles.addTicket, "mt-3 d-flex")}
              onClick={handleShowAddModal}
            />
          </div>
        )}
      </div>
      <AddTicketModal
        show={showAddModal}
        handleClose={handleCloseAddModal}
        list={list}
        setList={setList}
        setMessageList={setMessageList}
        setSelected={setSelected}
      />
    </DashboardWraper>
  );
}

export const getServerSideProps = withError(async ({ req, res }) => {
  const endpoint = JSON.parse(
    req?.cookies?.user ? req?.cookies?.user : "{}"
  )?.endpoint;
  const chatRes = await fetch(
    BaseURL + endpoint + Endpoint.partner.chat.getList,
    {
      headers: {
        Authorization: "Bearer " + req.cookies.token,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      next: { revalidate: 3600 },
    }
  );
  const chats = await chatRes.json();

  return { props: { chats, user: req?.cookies?.user } };
});

export default SupportChat;
